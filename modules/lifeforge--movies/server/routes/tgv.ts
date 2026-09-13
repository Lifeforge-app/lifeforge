import { JSDOM } from 'jsdom'
import z from 'zod'

import { LocationSchema } from '@lifeforge/server-utils'

import forge from '../forge'
import schema from '../schema'
import type { TGVBooking } from '../types/tgvBooking.type'
import type { TGVCinema } from '../types/tgvCinema.type'
import type { TGVExperienceAssets } from '../types/tgvExperienceAssets.type'
import type { TGVListing } from '../types/tgvListing.type'
import type { TGVMovieSession } from '../types/tgvMovieSession.type'
import type { TGVSeatPlan } from '../types/tgvSeatPlan.type'
import type { TGVSeatStatus } from '../types/tgvSeatStatus.type'
import type { TGVStates } from '../types/tgvStateData.type'

const stripHtml = (html: string) =>
  new JSDOM(html).window.document.body.textContent?.trim() ?? ''

let cachedSession: string | null = null

const tgvLogin = async (email: string, pin: string) => {
  const res = await fetch('https://api.tgv.com.my/api/members/v1/user_login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, pinchars: pin, mobtel: '' })
  })

  if (!res.ok) {
    throw new Error('Login failed')
  }

  const data = await res.json()
  cachedSession = data.results.mvcsessionid

  return cachedSession
}

const TGVResponseSchema = z.object({
  movies: z.array(
    z.object({
      itemkey: z.string(),
      recid: z.string(),
      name: z.string(),
      poster: z.string(),
      genres: z.array(z.string()),
      duration: z.number(),
      overview: z.string(),
      language: z.string(),
      release_date: z.string()
    })
  )
})

export const list = forge
  .query({
    description: 'Fetch movies from TGV Cinemas by type',
    input: {
      query: z.object({
        type: z.enum(['nowShowing', 'comingSoon'])
      })
    },
    output: {
      OK: TGVResponseSchema,
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ query: { type }, response }) => {
    const endpoint = type === 'nowShowing' ? 'nowselling' : 'comingsoon'

    const res = await fetch(
      `https://api.tgv.com.my/api/movies/v1/movielist/${endpoint}`
    )

    if (!res.ok) {
      return response.badRequest('Failed to fetch data from TGV')
    }

    const data: TGVListing = await res.json()

    return response.ok({
      movies: data.results.movies.map(movie => {
        const posterAsset = movie.assets?.find(a => a.assetkey === 'poster')

        return {
          itemkey: movie.itemkey,
          recid: movie.recid,
          name: movie.name,
          poster: posterAsset?.extdata?.fileinfo?.fileurl ?? '',
          genres: movie.extdata?.movieinfo?.genre ?? [],
          duration: Number(movie.extdata?.movieinfo?.runtimemins) || 0,
          overview: stripHtml(movie.extdata?.movieinfo?.synopsis ?? ''),
          language: movie.extdata?.movieinfo?.lang ?? '',
          release_date: movie.extdata?.movieinfo?.releasedatemy ?? ''
        }
      })
    })
  })

export const hasCachedSession = forge
  .query({
    description: 'Check if TGV session is cached and valid',
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ response }) => {
    if (!cachedSession) {
      return response.ok(false)
    }

    const res = await fetch(
      'https://api.tgv.com.my/api/members/v1/user_sessioncheck',
      {
        headers: { 'x-mvcsession': cachedSession }
      }
    )

    if (!res.ok) {
      cachedSession = null

      return response.ok(false)
    }

    const data = await res.json()

    if (data.results === true) {
      return response.ok(true)
    }

    cachedSession = null

    return response.ok(false)
  })

export const fetchTicket = forge
  .mutation({
    description: 'Fetch TGV booking ticket by movie recid',
    input: {
      body: z.object({
        email: z.string().optional(),
        pin: z.string().optional(),
        tgvId: z.string()
      })
    },
    output: {
      OK: z.union([
        schema.entries
          .pick({
            theatre_location: true,
            theatre_number: true,
            theatre_seat: true,
            theatre_showtime: true,
            ticket_number: true
          })
          .extend({
            theatre_location_coords: LocationSchema.shape.location.nullable()
          }),
        z.literal(false)
      ]),
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      pb,
      body: { email, pin, tgvId },
      response,
      core: {
        api: { searchLocations, getAPIKey }
      }
    }) => {
      let sessionId = cachedSession

      if (!sessionId) {
        if (!email || !pin) {
          return response.badRequest(
            'No cached session and email/pin not provided'
          )
        }

        try {
          sessionId = await tgvLogin(email, pin)
        } catch {
          return response.badRequest('Login failed')
        }
      }

      const bookingsRes = await fetch(
        'https://api.tgv.com.my/api/boxoffice/v1/userbookings_get',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-mvcsession': sessionId || ''
          },
          body: JSON.stringify({ startrowindex: 0, maxrows: 100 })
        }
      )

      if (!bookingsRes.ok) {
        return response.badRequest('Failed to fetch bookings')
      }

      const bookingsData: TGVBooking = await bookingsRes.json()
      const booking = bookingsData.results.bookings.find(
        b => b.booking.itemkey === tgvId
      )

      if (!booking) {
        return response.ok(false)
      }

      let location = booking.cinemainfo.name
      let locationCoords: z.infer<typeof LocationSchema.shape.location> | null =
        null

      const gcloudAPIKey = await getAPIKey('gcloud', pb)

      if (gcloudAPIKey) {
        const locSearchResults = await searchLocations(
          gcloudAPIKey,
          `TGV ${location}`
        )

        if (locSearchResults.length) {
          const target = locSearchResults[0]
          location = target.name
          locationCoords = target.location
        }
      }

      return response.ok({
        ticket_number: booking.booking.vistabookingid,
        theatre_seat: booking.tickets
          .flatMap(t => t.seats.map(s => s.name))
          .join(', '),
        theatre_showtime: booking.sessioninfo.sessiondatemy,
        theatre_location: location,
        theatre_location_coords: locationCoords,
        theatre_number: booking.sessioninfo.screenname
      })
    }
  )

export const getSessionDates = forge
  .query({
    description: 'Get available session business dates for a TGV movie',
    input: {
      query: z.object({
        movieId: z.string()
      })
    },
    output: {
      OK: z.array(z.string()),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ query: { movieId }, response }) => {
    const res = await fetch(
      'https://api.tgv.com.my/api/boxoffice/v1/moviesession_getsessionbusinessdates',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieid: movieId,
          location: '',
          experienceGroup: ''
        })
      }
    )

    if (!res.ok) {
      return response.badRequest('Failed to fetch session dates')
    }

    const data = await res.json()

    return response.ok(data.results.businessdates as string[])
  })

const CinemaSchema = z.object({
  id: z.string(),
  name: z.string()
})

const AreaSchema = z.object({
  state: z.string(),
  label: z.string(),
  cinemas: z.array(CinemaSchema)
})

export const getMovieCinemas = forge
  .query({
    description: 'Get cinemas screening a movie on a given date',
    input: {
      query: z.object({
        movieId: z.string(),
        businessDate: z.string()
      })
    },
    output: {
      OK: z.array(AreaSchema),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ query: { movieId, businessDate }, response }) => {
    const [stateRes, movieRes] = await Promise.all([
      fetch('https://api.tgv.com.my/api/cinemas/v1/getstatecinema'),
      fetch(
        'https://api.tgv.com.my/api/boxoffice/v1/moviesession_getmoviecinemas',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessday: businessDate,
            movieid: movieId,
            experienceGroup: ''
          })
        }
      )
    ])

    if (!stateRes.ok || !movieRes.ok) {
      return response.badRequest('Failed to fetch cinemas')
    }

    const stateData: TGVStates = await stateRes.json()
    const movieData: TGVCinema = await movieRes.json()

    const screeningIds = new Set(
      movieData.results.locations.flatMap(loc =>
        loc.cinemaids.map(c => c.cinemaid as string)
      )
    )

    return response.ok(
      stateData.results
        .map(s => ({
          state: s.value,
          label: s.label,
          cinemas: s.cinemas
            .filter(c => screeningIds.has(c.cinemaid))
            .map(c => ({
              id: c.cinemaid,
              name: c.name
            }))
        }))
        .filter(s => s.cinemas.length > 0)
    )
  })

const SessionSchema = z.object({
  sessionid: z.string(),
  screenname: z.string(),
  showtime: z.string(),
  experience: z.string(),
  seatstotal: z.number(),
  seatsused: z.number(),
  usedpercentage: z.number()
})

export const getMovieSessions = forge
  .query({
    description: 'Get sessions for a movie at a cinema on a given date',
    input: {
      query: z.object({
        cinemaId: z.string(),
        businessDate: z.string(),
        movieId: z.string()
      })
    },
    output: {
      OK: z.array(SessionSchema),
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({ query: { cinemaId, businessDate, movieId }, response }) => {
      const sessionRes = await fetch(
        'https://api.tgv.com.my/api/boxoffice/v1/moviesession_get',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cinemaid: cinemaId,
            businessdate: businessDate,
            movieid: movieId,
            retrieveexpired: false
          })
        }
      )

      if (!sessionRes.ok) {
        return response.badRequest('Failed to fetch sessions')
      }

      const sessionData: TGVMovieSession = await sessionRes.json()

      const sessions =
        sessionData.results.businessday.cinemas[0]?.movies[0]?.experiences?.flatMap(
          exp =>
            exp.sessions.map(s => ({
              sessionid: s.sessionid,
              screenname: s.screenname,
              showtime: s.showtimemy,
              experience: exp.experience,
              seatstotal: 0,
              seatsused: 0,
              usedpercentage: 0
            }))
        ) ?? []

      if (sessions.length === 0) {
        return response.ok([])
      }

      const seatRes = await fetch(
        '	https://api.tgv.com.my/api/boxoffice/v1/moviesession_getseatstatus',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cinemaid: cinemaId,
            sessionid: sessions.map(s => s.sessionid)
          })
        }
      )

      if (seatRes.ok) {
        const seatData: TGVSeatStatus = await seatRes.json()
        const seatMap = new Map(
          seatData.results.seatstatuslist.map(s => [s.sessionid, s])
        )

        for (const session of sessions) {
          const seatStatus = seatMap.get(session.sessionid)

          if (seatStatus) {
            session.seatstotal = seatStatus.seatstotal
            session.seatsused = seatStatus.seatsused
            session.usedpercentage = seatStatus.usedpercentage
          }
        }
      }

      return response.ok(sessions)
    }
  )

const ExperienceLogoSchema = z.object({
  key: z.string(),
  subject: z.string(),
  logoUrl: z.string()
})

export const getExperienceLogos = forge
  .query({
    description: 'Get experience logos from TGV',
    output: {
      OK: z.array(ExperienceLogoSchema),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ response }) => {
    const res = await fetch(
      'https://api.tgv.com.my/api/contentblocks/v1/getcontentblockitemkey',
      {
        method: 'POST',
        body: JSON.stringify({ itemkey: 'seat-description' }),
        headers: { 'Content-Type': 'application/json' }
      }
    )

    if (!res.ok) {
      return response.badRequest('Failed to fetch experience data')
    }

    const data: TGVExperienceAssets = await res.json()

    const assetMap = new Map(
      data.results.contentblock.assets.map(a => [
        a.assetkey,
        a.extdata.fileinfo.fileurl
      ])
    )

    return response.ok(
      data.results.contentblock.extdata.contentblock.seating.map(s => ({
        key: s.key,
        subject: s.subject,
        logoUrl: assetMap.get(s.logo) ?? ''
      }))
    )
  })

const SeatSchema = z.object({
  columnIndex: z.number(),
  status: z.number(),
  seatsInGroup: z
    .array(
      z.object({
        areaNumber: z.number(),
        rowIndex: z.number(),
        columnIndex: z.number()
      })
    )
    .nullable()
})

const RowSchema = z.object({
  physicalName: z.string(),
  seats: z.array(SeatSchema)
})

const SeatPlanSchema = z.object({
  areas: z.array(
    z.object({
      rows: z.array(RowSchema)
    })
  ),
  screenStart: z.number(),
  screenWidth: z.number(),
  boundaryRight: z.number(),
  boundaryLeft: z.number(),
  boundaryTop: z.number()
})

export const getSeatPlan = forge
  .query({
    description: 'Get seat plan for a movie session',
    input: {
      query: z.object({
        sessionId: z.string(),
        cinemaId: z.string()
      })
    },
    output: {
      OK: SeatPlanSchema,
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ query: { sessionId, cinemaId }, response }) => {
    const res = await fetch(
      'https://api.tgv.com.my/api/boxoffice/v1/moviesession_getseatplan',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionid: sessionId,
          cinemaid: cinemaId
        })
      }
    )

    if (!res.ok) {
      return response.badRequest('Failed to fetch seat plan')
    }

    const data: TGVSeatPlan = await res.json()
    const layout = data.results.seatlayout

    return response.ok({
      areas: layout.areas.map(area => ({
        rows: area.rows.map(row => ({
          physicalName: row.physicalName || '',
          seats: row.seats.map(seat => ({
            columnIndex: seat.position.columnIndex,
            status: seat.status,
            seatsInGroup:
              seat.seatsInGroup?.map(g => ({
                areaNumber: g.areaNumber,
                rowIndex: g.rowIndex,
                columnIndex: g.columnIndex
              })) ?? null
          }))
        }))
      })),
      screenStart: layout.screenStart,
      screenWidth: layout.screenWidth,
      boundaryRight: layout.boundaryRight,
      boundaryLeft: layout.boundaryLeft,
      boundaryTop: layout.boundaryTop
    })
  })
