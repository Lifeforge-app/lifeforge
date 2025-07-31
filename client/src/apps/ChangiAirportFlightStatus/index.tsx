
function ChangiAirportFlightStatus() {
  return (
    <ModuleWrapper
      <ModuleHeader icon="tabler:plane" title="Changi Flight Status" />
      <div className="mt-6 flex items-center gap-2">
        <Listbox
          as="div"
          className="relative"
          value={searchParams.get('type') ?? 'dep'}
          onChange={value => {
            setSearchParams({ type: value })
          }}
        >
          <ListboxButton
            className={clsx(
              'flex-between shadow-custom flex w-48 gap-2 rounded-md p-4',
              componentBgWithHover
            )}
          >
            <div className="flex items-center gap-2">
              <Icon
                className="size-6"
                icon={
                  SEARCH_TYPE.find(
                    ([, , value]) => value === searchParams.get('type')
                  )?.[1] || 'tabler:plane-departure'
                }
              />
              <span className="font-medium whitespace-nowrap">
                {SEARCH_TYPE.find(
                  ([, , value]) => value === searchParams.get('type')
                )?.[0] || 'Departure'}
              </span>
            </div>
            <Icon className="text-bg-500 size-5" icon="tabler:chevron-down" />
          </ListboxButton>
          <ListboxOrComboboxOptions>
            {SEARCH_TYPE.map(([name, icon, value]) => (
              <ListboxOrComboboxOption
                key={value}
                icon={icon}
                text={name}
                value={value}
              />
            ))}
          </ListboxOrComboboxOptions>
        </Listbox>
        <SearchInput
          hasTopMargin={false}
          namespace="modules.changiAirport"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="flight"
        />
      </div>
      <Scrollbar className="mt-6 w-full flex-1">
        <APIFallbackComponent data={flights}>
          {flights => (
            <table className="mr-8 mb-8 w-max">
              <thead>
                <tr className="border-bg-200 text-bg-500 dark:border-bg-800 border-b-2">
                  {[
                    'Status',
                    'Scheduled Time',
                    'Flight Number',
                    'Aircraft Type',
                    'Airline',
                    `${
                      (searchParams.get('type') ?? 'dep') === 'dep'
                        ? 'Destination'
                        : 'Origin'
                    } Airport`,
                    'Terminal',
                    'Gate',
                    (searchParams.get('type') ?? 'dep') === 'dep'
                      ? 'Check-In Row'
                      : 'Baggage Belt',
                    'Estimated Time',
                    'Code Share'
                  ].map(column => (
                    <th key={column} className={'p-2 font-medium'}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flights.getFlights.flights.map(flight => (
                  <tr
                    key={flight.flight_number + flight.scheduled_time}
                    className="border-bg-200 dark:border-bg-800 border-b"
                  >
                    <td className="p-2 text-center whitespace-nowrap">
                      <div
                        className={clsx(
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm whitespace-nowrap',
                          STATUSES[flight.flight_status]?.[0],
                          STATUSES[flight.flight_status]?.[2]
                        )}
                      >
                        <Icon
                          className="size-4"
                          icon={STATUSES[flight.flight_status]?.[1]}
                        />
                        {flight.flight_status}
                      </div>
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {flight.scheduled_time}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {flight.flight_number}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {'AB'.includes(flight.aircraft_type[0]) ? (
                          <Icon
                            icon={
                              flight.aircraft_type[0] === 'B'
                                ? 'simple-icons:boeing'
                                : 'simple-icons:airbus'
                            }
                          />
                        ) : (
                          ''
                        )}
                        {flight.aircraft_type}
                      </div>
                    </td>
                    <td className="p-2 text-left whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          alt={flight.airline_details.name}
                          className="size-6"
                          src={flight.airline_details.logo_url}
                        />
                        {flight.airline_details.name} ({flight.airline})
                      </div>
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {flight.airport_details.name} ({flight.airport})
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      T{flight.terminal}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {(searchParams.get('type') ?? 'dep') === 'dep'
                        ? flight.current_gate
                        : flight.display_gate}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {(searchParams.get('type') ?? 'dep') === 'dep'
                        ? flight.check_in_row
                        : flight.display_belt}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {flight.estimated_timestamp}
                    </td>
                    <td className="p-2 text-left whitespace-nowrap">
                      {flight.slave_flights.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </APIFallbackComponent>
      </Scrollbar>
    </ModuleWrAPPER>
  )
}

export default ChangiAirportFlightStatus
