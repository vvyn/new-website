import Head from 'next/head';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Event } from '../../lib/types';
import { useTransition, animated } from '@react-spring/web';
import FeatureEvent from '../../components/events/FeatureEvent';
import { getAllEvents } from '../api/events';

interface EventsPageProps {
  events: Event[];
}

export default function EventsPage({ events }: EventsPageProps) {
  const futureEvents: Event[] = [];
  const onGoingEvents: Event[] = [];
  const pastEvents: Event[] = [];
  const pastEventsCols = [[], [], []];

  events.forEach(function (eachEvent) {
    const startTime = new Date(eachEvent.startDate);
    const endTime = new Date(eachEvent.endDate);
    const timeNow = new Date();
    if (endTime < timeNow) pastEvents.push(eachEvent);
    else if (timeNow < startTime) futureEvents.push(eachEvent);
    else onGoingEvents.push(eachEvent);
  });

  const pastEventCards = pastEvents.map((event) => {
    return (
      <div key={event.id} className="my-4">
        <FeatureEvent key={event.id} event={event} />
      </div>
    );
  });

  for (let i = 0; i < pastEventCards.length; i++) {
    pastEventsCols[i % 3].push(pastEventCards[i]);
  }
  const futureEventCards = futureEvents.map((event) => {
    return <FeatureEvent key={event.id} event={event} />;
  });

  const onGoingEventCards = onGoingEvents.map((event) => {
    return <FeatureEvent key={event.id} event={event} onGoing={true} />;
  });

  let pastEventsDiv;
  if (pastEvents.length == 0) {
    pastEventsDiv = <div>There are no past events</div>;
  } else {
    pastEventsDiv = (
      <div className="flex flex-row flex-wrap">
        <div className="flex flex-col w-1/3 min-w-full xl:min-w-0">{pastEventsCols[0]}</div>
        <div className="flex flex-col w-1/3 min-w-full xl:min-w-0">{pastEventsCols[1]}</div>
        <div className="flex flex-col w-1/3 min-w-full xl:min-w-0">{pastEventsCols[2]}</div>
      </div>
    );
  }

  let upComingEventDiv;
    upComingEventDiv = (
      <div>
        <div className="text-center font-bold h-full p-10 rounded-3xl border-r-4 border-b-4 border-t-2 border-l-2 border-ais-new-light-blue m-auto mt-auto">
          <p className="text-4xl font-bold text-slate-700 sm:visible lg:invisible text-center justify-center content-center sm:pt-9 mt-[100px]">
            Upcoming Event
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start">
          <div className="flex mt-5">
            <EventsButton title="View All"/>
            <EventsButton title="Workshops"/>
            <EventsButton title="Socials"/>
            <EventsButton title="Others"/>
          </div>
          {futureEventCards.reverse()}
        </div>
      </div>
    );

  let onGoingEventDiv;
  if (onGoingEvents.length != 0) {
    onGoingEventDiv = (
      <section className="bg-ais-light-gray py-8">
        <div className="mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl py-2">
          <div className="text-3xl font-bold mb-4">Ongoing Events</div>
          {onGoingEventCards}
        </div>
      </section>
    );
  }

  const ref = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [items, set] = useState<string[]>([]);
  const transitions = useTransition(items, {
    from: {
      opacity: 0,
      height: 0,
      innerHeight: 0,
      transform: 'perspective(600px) rotateX(0deg)',
      color: '#8fa5b6',
    },
    enter: [
      { opacity: 1, height: 80, innerHeight: 80 },
      { transform: 'perspective(600px) rotateX(180deg)', color: '#28d79f' },
      { transform: 'perspective(600px) rotateX(0deg)' },
    ],
    leave: [{ color: '#c23369' }, { innerHeight: 0 }, { opacity: 0, height: 0 }],
    update: { color: '#28b4d7' },
  });

  const reset = useCallback(() => {
    ref.current.forEach(clearTimeout);
    ref.current = [];
    set([]);
    ref.current.push(setTimeout(() => set(['Coming']), 1000));
    ref.current.push(setTimeout(() => set(['Soon']), 2000));
    ref.current.push(setTimeout(() => set(['Coming', 'Soon']), 3000));
  }, []);

  useEffect(() => {
    reset();
    return () => ref.current.forEach(clearTimeout);
  }, []);
  return (
    <div>
      <Head>
        <title>Projects &ndash; AIS</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta
          name="description"
          content="An overview of all our AI/ML projects, including explanations and interactive demos."
        />
      </Head>
      <main className="flex flex-col justify-center min-h-screen bg-ais-new-beige">
        {onGoingEventDiv}
        <section className="py-8 px-2 mt-10">
          <div className="mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl py-2">
          <img
              src="decoration2.png"
              className="mb-10"
            />
            {upComingEventDiv}
            <img
              src="decoration1.png"
              className="w-30 float-right translate-x-20 -translate-y-20 opacity-80 invisible lg:visible"
            />
          </div>
        </section>
        <section className="py-8 px-2">
          <div className="mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl py-2">
            <img
              src="decoration3.png"
              className="mb-10"
            />
            {pastEventsDiv}
            <div className="items-end py-4">
              <EventsButton className="" title="View All"/>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const allEvents = await getAllEvents();

  return {
    props: {
      events: allEvents,
    },
  };
}

function EventsButton(props)
{
  return(
    <button
      className="h-[2rem] w-32 border-[2px] text-sm text-ais-new-med-blue border-ais-new-med-blue rounded-[1rem] whitespace-nowrap px-[1rem] hover:bg-ais-new-med-blue hover:text-ais-new-beige ml-2"
    >
      {props.title}
    </button>
  );
}
