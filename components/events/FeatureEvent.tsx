import {Event} from "../../lib/types";
import Link from 'next/link';
import Moment from "moment";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { google, outlook, ics } from 'calendar-link';
import { Menu } from '@headlessui/react';

interface EventItemProps {
  event: Event;
  onGoing?: boolean;
}

/**
 * An item that displays event details
 */
export default function FeatureEvent({ event, onGoing }: EventItemProps) {
  const { id, title, description, eventType, startDate, endDate, location, joinLink, tags } = event;
  const eventLink = `/events/${event.id}`;
  const eventTime = Moment(new Date(startDate)).format('MMM D, YYYY');

  const calEvent = {
    title: title,
    description: description,
    start: startDate,
    end: endDate,
    location: location === 'In-person' ? joinLink : null,
    url: location !== 'In-person' ? joinLink : null,
  };

  let pulsingDiv;
  let pulsingBG = '';
  if (onGoing) {
    pulsingBG = 'animate-pulse ';
    pulsingDiv = (
      <div className="absolute top-0 right-0 -my-2 -mx-2">
        <span className="flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500"></span>
        </span>
      </div>
    );
  }

  const tagElements = tags.map((tag) => {
    return (
      <div key={tag} className="bg-ais-dark-blue text-white rounded-xl p-2 text-xs font-bold">
        {tag.toLowerCase()}
      </div>
    );
  });

  /**
  let tagDiv;
  if (tags.length != 0) {
    tagDiv = (
      <div className="py-2">
        <div className="py-2 text-sm font-semibold">TAGS</div>
        <div className="flex flex-wrap gap-2">{tagElements}</div>
      </div>
    );
  }
   */

  return (
    <div
      key={id}
      className={
        'font-bold mx-4 h-full p-4 rounded-3xl border-r-4 border-b-4 border-t-2 border-l-2 border-ais-new-light-blue'
      }
    >
      <div className="bg-slate-300 w-full h-52 rounded-2xl mb-4"></div>
      <div className="font-bold text-ais-dark-blue text-xs flex flex-wrap justify-between gap-2">
        {eventType.toUpperCase()}
      </div>
      <div className="flex text-xl font-bold py-2">{title}</div>
      <div className="mb-2 font-bold text-ais-dark-blue text-xs flex flex-wrap justify-between gap-2">
        <div className="flex text-gray-600">
          <CalendarTodayIcon style={{ fontSize: 14 }} />
          <div className="mx-2 ">{eventTime}</div>
        </div>
      </div>
      <div>
        <div className="text-xs">{description}</div>
      </div>
      <div className="flex text-ais-light-blue text-sm gap-4 font-bold pt-6">
        <Link href={eventLink}>LEARN MORE</Link>
        <Menu as="div" className="relative">
          <Menu.Button className="font-bold">SAVE</Menu.Button>
          <Menu.Items className="origin-top-left absolute left-0 rounded-md w-28 bg-ais-white shadow-xl z-10 text-black">
            <Menu.Item>
              <a
                target="_blank"
                href={ics(calEvent)}
                className="transition duration-400 group flex gap-2 items-center px-4 py-2 text-sm hover:bg-ais-blue-gray hover:text-black rounded-sm"
                rel="noreferrer"
              >
                <img src="/apple.svg" className="h-5" />
                Apple
              </a>
            </Menu.Item>
            <Menu.Item>
              <a
                target="_blank"
                href={google(calEvent)}
                className="transition duration-400 group flex gap-2 items-center px-4 py-2 text-sm hover:bg-ais-blue-gray hover:text-black rounded-sm"
                rel="noreferrer"
              >
                <img src="/google.svg" className="h-4" />
                Google
              </a>
            </Menu.Item>
            <Menu.Item>
              <a
                target="_blank"
                href={outlook(calEvent)}
                className="transition duration-400 group flex gap-2 items-center px-4 py-2 text-sm hover:bg-ais-blue-gray hover:text-black rounded-sm"
                rel="noreferrer"
              >
                <img src="/outlook.svg" className="h-4" />
                Outlook
              </a>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
}