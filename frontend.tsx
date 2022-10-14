import React, { useState, useEffect } from 'react'
import { api, urls, Link, PersonHeader, AdHocInsight, TZLabel } from '@posthog/apps-common'
import { LemonTable } from '@posthog/lemon-ui'

export const scene = {
    title: 'Feedback',
    component: FeedbackWidget,
}

function useEvents(eventName: string) {
    const [events, setEvents] = useState([])
    const [eventsLoading, setEventsLoading] = useState(true)
    useEffect(() => {
        const fetchEvents = async () => {
            const response = await api.events.list({
                properties: [],
                event: eventName,
                orderBy: ['-timestamp'],
                after: null,
            })
            setEvents(response.results)
            setEventsLoading(false)
        }
        fetchEvents()
    }, [])
    return { events, eventsLoading }
}

function useFilters(eventName: string) {
    return {
        insight: 'TRENDS',
        events: [{ id: eventName, name: eventName, type: 'events', order: 0 }],
        actions: [],
        display: 'ActionsLineGraph',
        interval: 'day',
        new_entity: [],
        properties: [],
        filter_test_accounts: false,
        date_from: '-14d',
    }
}

function FeedbackWidget({ config }) {
    const eventName = config.eventName || 'Feedback Sent'
    const { events, eventsLoading } = useEvents(eventName)
    const filters = useFilters(eventName)

    return (
        <>
            <h2>Feedback received in the last 14 days</h2>
            {eventsLoading ? (
                <div>Loading...</div>
            ) : events.length === 0 ? (
                <div>No feedback has been submitted</div>
            ) : (
                <>
                    <AdHocInsight filters={filters} style={{ height: 200 }} />
                    <LemonTable
                        dataSource={events}
                        columns={[
                            {
                                key: 'feedback',
                                title: 'Feedback',
                                render: (_, event) => {
                                    return <div>{event.properties[config.feedbackProperty || '$feedback']}</div>
                                },
                            },
                            {
                                key: 'distinct_id',
                                title: 'Author',
                                render: (_, event) => {
                                    console.log({ event })
                                    return event.person ? (
                                        <Link to={urls.person(event.person.distinct_ids[0])}>
                                            <PersonHeader noLink withIcon person={event.person} />
                                        </Link>
                                    ) : (
                                        'Unknown user'
                                    )
                                },
                            },
                            {
                                key: 'timestamp',
                                title: 'Sent',
                                render: (_, event) => <TZLabel time={event.timestamp} showSeconds />,
                            },
                        ]}
                    />
                </>
            )}
        </>
    )
}
