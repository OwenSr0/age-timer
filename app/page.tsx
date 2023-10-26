"use client"
import React, {useState, useEffect, useCallback } from "react";
import moment from 'moment';
import Button from '@mui/material/Button';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

export default function Home() {
  const [array, setArray] = useState(new Array(6).fill(''));
  const [timing, setTiming] = useState('');
  const [time, setTime] = useState(Object);
  const [user, setUser] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  function handleClick() {
    const string = array.join("-")
    setTiming(string)
    console.log(timing)
    if (!array[0]||!array[1]||!array[2]) {
      alert("You should select your age");
      return;
    }
    console.log(timing)
    window.localStorage.setItem('loggedDate', timing);
    window.location.reload()
  }

  function handledays(day: any) {
    const newArray = [...array]
    newArray[0] = day._d.getUTCFullYear();
    newArray[1] = day._d.getUTCMonth(); 
    newArray[2] = day._d.getUTCDate();
    const string = newArray.join("-")
    setArray(newArray);
    setTiming(string)
  }
  function handleTime(time: any) {
    const newArray = [...array]
    newArray[3] = time._d.getHours();
    newArray[4] = time._d.getMinutes(); 
    newArray[5] = 0;
    setArray(newArray)
    const string = array.join("-")
    setTiming(string)
  }

  const arrayToDate = useCallback((array: any) => {
    const momentDate = moment({
      year: array[0],
      month: array[1],
      day: array[2],
      hour: array[3],
      minute: array[4],
      second: array[5],
    });
    return momentDate;
  }, []);

  const printEverySecond = useCallback(() => {
    const currentTime = moment();
    const stringToArray = timing.split("-");
    const date = arrayToDate(stringToArray);
  
    const duration = moment.duration(currentTime.diff(date));
    setTime({
      years: duration.years(),
      months: duration.months(),
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    });
  }, [timing, arrayToDate]);

  useEffect(() => {
    if(initialRender){
      const loggedData = window.localStorage.getItem('loggedDate')
      setTiming(loggedData ?? '');
      if (loggedData) {
        setUser(true);
        const intervalId = setInterval(printEverySecond, 1000);
        return () => clearInterval(intervalId);
      }
      setInitialRender(false);
    }
  }, [printEverySecond, initialRender]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col h-full items-center font-mono text-sm lg:flex">
        {user ? (
          <div className="flex flex-col h-full items-center">
          <h1 className="text-2xl mx-5">Time is running out </h1>
          <p className="text-lg mx-5">{time.years} years {time.months} months {time.days} days {time.hours} hours {time.minutes} minutes {time.seconds} seconds</p>
          </div>
        ) : (
            <div>
            <div className='flex'>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <div className='m-2'>
                <DatePicker 
                onChange={(e) => handledays(e)} 
                label="Basic date picker" />
              </div>
              <div className='m-2'>
              <TimePicker
                label="With Time Clock"
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                  onChange={(e: any) => handleTime(e)}
                  />
              </div>
            </LocalizationProvider>
          </div>
          <div className='flex justify-center'>
            <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={(e) => {handleClick();}}
            id="custom-button"
            >Calculate</Button>
          </div>
        </div>
        )}
      </div>
    </main>
  )
}
