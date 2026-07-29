# Bills Tracker

A React practice app for keeping track of monthly bills — add them, edit them, delete them, and see the total at a glance.

## What it does

- Lists your bills (starts with a few mock ones: rent, electricity, water, internet, phone)
- Add a new bill with a name and amount
- Edit a bill's name or amount in place, or delete it
- Running total of all current bills, formatted as currency, recalculated automatically as the list changes

## Tech

- React (Create React App)
- `useMemo` for the total so it only recalculates when the bill list actually changes
- Plain CSS, no UI library

## Running it locally

```bash
npm install
npm start
```

Open http://localhost:3000.
