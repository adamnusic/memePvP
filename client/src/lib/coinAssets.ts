import { TextureLoader } from 'three';

// Array of all available coin images
export const COIN_IMAGES = [
  '/attached_assets/bogdanoff1739344303548.png',
  '/attached_assets/trump_coin.png',
  '/attached_assets/Shiba_Inu_coin_logo.png',
  '/attached_assets/pudgy_penguins1734444110427.png',
  '/attached_assets/pepe-pepe-logo.png',
  '/attached_assets/images.png',
  '/attached_assets/fartcoin1729526044230.png',
  '/attached_assets/Dogecoin_Logo.png',
  '/attached_assets/28752.png',
  '/attached_assets/630de341f8184351dc5cb644.png',
  '/attached_assets/1efb95b3-87ad-6580-8d81-0550130ddbf1.png'
];

// Create a singleton texture loader
export const textureLoader = new TextureLoader();

// Function to get a random coin image URL
export const getRandomCoinImage = () => {
  const randomIndex = Math.floor(Math.random() * COIN_IMAGES.length);
  return COIN_IMAGES[randomIndex];
};
