// Central registry of every CDN-hosted game asset.
import runVideo from "@/assets/Run_Chiku.mp4.asset.json";
import jumpVideo from "@/assets/jump_chiku.mp4.asset.json";
import superVideo from "@/assets/super_chiku.mp4.asset.json";
import bgVideo from "@/assets/background.mp4.asset.json";

import heading from "@/assets/heading.png.asset.json";
import lollypopBig from "@/assets/lollypop.png.asset.json";
import coinBig from "@/assets/coin.png.asset.json";

import eBat from "@/assets/e_bat.png.asset.json";
import eBee from "@/assets/e_bee.png.asset.json";
import eCactus from "@/assets/e_cactus.png.asset.json";
import eCrow from "@/assets/e_crow.png.asset.json";
import eGhost from "@/assets/e_ghost.png.asset.json";
import eLog from "@/assets/e_log.png.asset.json";
import eMushroom from "@/assets/e_mushroom.png.asset.json";
import ePlant from "@/assets/e_plant.png.asset.json";
import eRock from "@/assets/e_rock.png.asset.json";
import eSnail from "@/assets/e_snail.png.asset.json";
import eSpike from "@/assets/e_spike.png.asset.json";

import oBush from "@/assets/o_bush.png.asset.json";
import oCone from "@/assets/o_cone.png.asset.json";
import oCrate from "@/assets/o_crate.png.asset.json";
import oHole from "@/assets/o_hole.png.asset.json";
import oPost from "@/assets/o_post.png.asset.json";
import oRocks from "@/assets/o_rocks.png.asset.json";
import oSpikeball from "@/assets/o_spikeball.png.asset.json";
import oStump from "@/assets/o_stump.png.asset.json";
import oVine from "@/assets/o_vine.png.asset.json";

import coinPaw from "@/assets/coin_paw.png.asset.json";
import coinHeart from "@/assets/coin_heart.png.asset.json";
import coinChiku from "@/assets/coin_chiku.png.asset.json";
import chest from "@/assets/chest.png.asset.json";

import pLollipop from "@/assets/p_lollipop.png.asset.json";
import pHeart from "@/assets/p_heart.png.asset.json";
import pShield from "@/assets/p_shield.png.asset.json";
import pSlow from "@/assets/p_slow.png.asset.json";
import p3x from "@/assets/p_3x.png.asset.json";

import dRainbow from "@/assets/d_rainbow.png.asset.json";
import dCloud1 from "@/assets/d_cloud1.png.asset.json";
import dCloud2 from "@/assets/d_cloud2.png.asset.json";
import dSun from "@/assets/d_sun.png.asset.json";
import dButterfly1 from "@/assets/d_butterfly1.png.asset.json";
import dButterfly2 from "@/assets/d_butterfly2.png.asset.json";
import dWind from "@/assets/d_wind.png.asset.json";

// Game-over clip. Drop `cry_chiku.mp4` in the uploads, create its asset pointer,
// import it above and set this to that url — the Game Over screen picks it up
// automatically. Until then it falls back to the lollipop art.
export const CRY_VIDEO: string | null = null;

export const VIDEOS = {
  run: runVideo.url,
  jump: jumpVideo.url,
  super: superVideo.url,
  background: bgVideo.url,
};

export const UI = {
  heading: heading.url,
  lollypop: lollypopBig.url,
  coin: coinBig.url,
  shield: pShield.url,
  slow: pSlow.url,
  x3: p3x.url,
  heart: pHeart.url,
  coinPaw: coinPaw.url,
};

export const SPRITES = {
  e_bat: eBat.url,
  e_bee: eBee.url,
  e_cactus: eCactus.url,
  e_crow: eCrow.url,
  e_ghost: eGhost.url,
  e_log: eLog.url,
  e_mushroom: eMushroom.url,
  e_plant: ePlant.url,
  e_rock: eRock.url,
  e_snail: eSnail.url,
  e_spike: eSpike.url,
  o_bush: oBush.url,
  o_cone: oCone.url,
  o_crate: oCrate.url,
  o_hole: oHole.url,
  o_post: oPost.url,
  o_rocks: oRocks.url,
  o_spikeball: oSpikeball.url,
  o_stump: oStump.url,
  o_vine: oVine.url,
  coin_paw: coinPaw.url,
  coin_heart: coinHeart.url,
  coin_chiku: coinChiku.url,
  chest: chest.url,
  p_lollipop: pLollipop.url,
  p_heart: pHeart.url,
  p_shield: pShield.url,
  p_slow: pSlow.url,
  p_3x: p3x.url,
  d_rainbow: dRainbow.url,
  d_cloud1: dCloud1.url,
  d_cloud2: dCloud2.url,
  d_sun: dSun.url,
  d_butterfly1: dButterfly1.url,
  d_butterfly2: dButterfly2.url,
  d_wind: dWind.url,
};

export type SpriteKey = keyof typeof SPRITES;

export type SpriteBank = Record<SpriteKey, HTMLImageElement>;

export function loadSprites(): Promise<SpriteBank> {
  const keys = Object.keys(SPRITES) as SpriteKey[];
  return Promise.all(
    keys.map(
      (key) =>
        new Promise<[SpriteKey, HTMLImageElement]>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve([key, img]);
          img.onerror = () => resolve([key, img]);
          img.src = SPRITES[key];
        }),
    ),
  ).then((entries) => Object.fromEntries(entries) as SpriteBank);
}
