import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { html } from 'hono/html';
import type { FrameSignaturePacket } from './types';

const app = new Hono();

// Your uploaded image URL - replace with the actual hosted image URL
const uploadedImageUrl = 'https://imgur.com/a/T6JWdtv';

app.get('/', (c) => {
  // Replace the placeholder URL with the URL of the uploaded image
  const frameImage = uploadedImageUrl;
  const framePostUrl = c.req.url;

  // Initially, no alert is displayed
  const initialAlert = 'Waiting for scam alerts...';

  return c.html(html`
    <html lang="en">
      <head>
        <!-- Meta tags with content from the uploaded image -->
        <meta property="og:image" content="${frameImage}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameImage}" />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:post_url" content="${framePostUrl}" />
        <title>Farcaster Scam Alert Frame</title>
      </head>
      <body style="background-image: url('${frameImage}'); background-size: cover;">
        <div id="alert-box">
          <h1>Farcaster Scam Alert</h1>
          <p>${initialAlert}</p>
        </div>
      </body>
    </html>
  `);
});

app.post('/forta-alerts', async (c) => {
  try {
    // Assuming the body of the request is the alert data
    const alertData = await c.req.json();
    console.log('Received alert:', alertData);
    
    // Display the alert as a cast/reply in the Farcaster frame
    const frameImage = uploadedImageUrl;
    const framePostUrl = c.req.url;

    return c.html(html`
      <html lang="en">
        <head>
          <!-- Meta tags with content from the uploaded image -->
          <meta property="og:image" content="${frameImage}" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${frameImage}" />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta property="fc:frame:post_url" content="${framePostUrl}" />
          <title>Farcaster Scam Alert Frame</title>
        </head>
        <body style="background-image: url('${frameImage}'); background-size: cover;">
          <div id="alert-box">
            <h1>Farcaster Scam Alert</h1>
            <!-- Displaying the alert message -->
            <p>${alertData.message || 'Scam alert received!'}</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Invalid request' }, 400);
  }
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
