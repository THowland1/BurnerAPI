// __tests__/animal.test.js
// // 🚨 Remember to keep your `*.test.js` files out of your `/pages` directory!
// import { createMocks } from 'node-mocks-http';
// import handle from 'pages/api/endpoints/[endpointId]';

// describe('/api/[animal]', () => {
//   test('returns a message with the specified animal', async () => {
//     const { req, res } = createMocks({
//       method: 'GET',
//       query: {
//         animal: 'dog',
//       },
//     });

//     await handle(req, res);

//     expect(res._getStatusCode()).toBe(200);
//     expect(JSON.parse(res._getData())).toEqual(
//       expect.objectContaining({
//         message: 'Your favorite animal is dog',
//       })
//     );
//   });
// });
