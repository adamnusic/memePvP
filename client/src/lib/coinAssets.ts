import { TextureLoader, Texture } from 'three';

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
const textureLoader = new TextureLoader();

// Cache for loaded textures
const textureCache = new Map<string, Texture>();

// Pre-load all textures
export const preloadTextures = () => {
  COIN_IMAGES.forEach(imageUrl => {
    if (!textureCache.has(imageUrl)) {
      textureLoader.load(
        imageUrl,
        (texture) => {
          texture.flipY = false;
          textureCache.set(imageUrl, texture);
          console.log(`Texture loaded: ${imageUrl}`);
        },
        undefined,
        (error) => console.error(`Error loading texture ${imageUrl}:`, error)
      );
    }
  });
};

// Get a random texture from the cache, or load if not cached
export const getRandomCoinTexture = (): Promise<Texture> => {
  const randomIndex = Math.floor(Math.random() * COIN_IMAGES.length);
  const imageUrl = COIN_IMAGES[randomIndex];

  return new Promise((resolve, reject) => {
    if (textureCache.has(imageUrl)) {
      resolve(textureCache.get(imageUrl)!);
    } else {
      textureLoader.load(
        imageUrl,
        (texture) => {
          texture.flipY = false;
          textureCache.set(imageUrl, texture);
          resolve(texture);
        },
        undefined,
        reject
      );
    }
  });
};

// Initialize preloading
preloadTextures();