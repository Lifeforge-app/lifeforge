import ClientError from '@functions/ClientError'
import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { CalendarControllersSchemas } from 'shared/types/controllers'

import * as CalendarsService from '../services/calendars.service'

const calendarCalendarsRouter = express.Router()

const getAllCalendars = forgeController
  .route('GET /')
  .description('Get all calendars')
  .schema(CalendarControllersSchemas.Calendars.getAllCalendars)
  .callback(async ({ pb }) => await CalendarsService.getAllCalendars(pb))

const getCalendarById = forgeController
  .route('GET /:id')
  .description('Get a calendar by ID')
  .schema(CalendarControllersSchemas.Calendars.getCalendarById)
  .existenceCheck('params', {
    id: 'calendar__calendars'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await CalendarsService.getCalendarById(pb, id)
  )

const createCalendar = forgeController
  .route('POST /')
  .description('Create a new calendar')
  .schema(CalendarControllersSchemas.Calendars.createCalendar)
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    if (
      await pb
        .collection('calendar__calendars')
        .getFirstListItem(`name="${body.name}"`)
        .catch(() => null)
    ) {
      throw new ClientError('Calendar with this name already exists')
    }

    return await CalendarsService.createCalendar(pb, body)
  })

const updateCalendar = forgeController
  .route('PATCH /:id')
  .description('Update an existing calendar')
  .schema(CalendarControllersSchemas.Calendars.updateCalendar)
  .existenceCheck('params', {
    id: 'calendar__calendars'
  })
  .callback(async ({ pb, params: { id }, body }) => {
    if (
      await pb
        .collection('calendar__calendars')
        .getFirstListItem(`name="${body.name}" && id != "${id}"`)
        .catch(() => null)
    ) {
      throw new ClientError('Calendar with this name already exists')
    }

    return await CalendarsService.updateCalendar(pb, id, body)
  })

const deleteCalendar = forgeController
  .route('DELETE /:id')
  .description('Delete an existing calendar')
  .schema(CalendarControllersSchemas.Calendars.deleteCalendar)
  .existenceCheck('params', {
    id: 'calendar__calendars'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) =>
      await CalendarsService.deleteCalendar(pb, id)
  )

bulkRegisterControllers(calendarCalendarsRouter, [
  getAllCalendars,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar
])

export default calendarCalendarsRouter
