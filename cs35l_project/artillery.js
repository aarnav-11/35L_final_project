const sessionCookie = "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJpYXQiOjE3NjQ0MDQ4MjEsImV4cCI6MTc2NDQwNzUyMX0.iME2LUygbAp632t5L4UTOTR68SN9Ii627uSExuxGmfk";
console.log(sessionCookie);


export const config = {
    target: 'http://localhost:3000',
    processor: './artillery-processor.cjs',
    phases: [
      {
        duration: 30,
        arrivalRate: 5,
        name: 'Warm-up'
      },
      {
        duration: 60,
        arrivalRate: 15,
        name: 'Sustained Load'
      },
      {
        duration: 30,
        arrivalRate: 40,
        name: 'Spike'
      },
      {
        duration: 30,
        arrivalRate: 10,
        name: 'Cool-down'
      }
    ],
    defaults: {
        headers: {
          Cookie: sessionCookie,
          'Content-Type': 'application/json',
        },
      },
  };
   
export const scenarios = [
    {
      name: 'fetch-users',
      weight: 5,
      flow: [
        {
          get: {
            url: '/api/notes',
          }
        }
      ]
    },
    {
        name: 'create-note',
        weight: 2,
        flow: [
        { function: 'setNoteBody' },
        {
            post: {
            url: '/api/notes',
            json: {
                title: '{{ noteTitle }}',
                text: '{{ noteBody }}',
            },
            capture: {
                json: '$.id',
                as: 'createdNoteId',
            },
            },
        },
      ],
    },
    {
    name: 'delete-note',
    weight: 1,
    flow: [
      { function: 'setNoteBody' },
      {
        post: {
          url: '/api/notes',
          json: {
            title: '{{ noteTitle }}',
            text: '{{ noteBody }}',
          },
          capture: {
            json: '$.id',
            as: 'noteToDelete',
          },
        },
      },
      { think: 1 },
      {
        delete: {
          url: '/api/notes/{{ noteToDelete }}',
        },
      },
    ],
    },

    {
    name: 'user-session',
    weight: 2,
    flow: [
    { function: 'setNoteBody' },
        { get: { url: '/api/notes' } },
        { think: 2 },
        { function: 'setNoteBody' },
        {
            post: {
            url: '/api/notes',
            json: {
                title: '{{ noteTitle }}',
                text: '{{ noteBody }}',
            },
            },
        },
        { think: 1 },
        { get: { url: '/api/notes' } },
        ],
    },
];
