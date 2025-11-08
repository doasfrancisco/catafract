import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

const asset = await mux.video.assets.create({
  inputs: [{ url: 'https://muxed.s3.amazonaws.com/leds.mp4' }],
  playback_policies: ['public'],
  video_quality: 'basic',
});

// console.log('Created asset:', asset);

// const asset = await mux.video.assets.retrieve("5oQu2YqycB02ajsaniOI2Bp2uecLbcnATpz1Jgo12aWw");
// console.log('Retrieved asset:', asset);