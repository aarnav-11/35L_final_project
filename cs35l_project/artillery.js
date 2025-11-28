const sessionCookie = `accessToken=${process.env.ARTILLERY_COOKIE}`;
console.log(sessionCookie);

export const config = {
    target: 'http://localhost:3000',
    phases: [
      {
        duration: 60,
        arrivalRate: 10
      }
    ],
    defaults: {
        headers: {
          Cookie: sessionCookie,
          'Content-Type': 'application/json',
        },
      },
  }
   
  export const scenarios = [
    {
      name: 'fetch-users',
      flow: [
        {
          get: {
            url: '/api/notes',
          }
        }
      ]
    }
  ];