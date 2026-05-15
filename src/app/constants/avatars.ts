// Avatar system for CashLenX
// Demo avatar is exclusive for demo/guest users
// Users can select from 6 other avatars

import maca_ghost_avatar_0_demo_square from "figma:asset/f9b59ca5421b2b7ef2e31c2ba4d827f48d22594a.png";
import maca_ghost_avatar_1_smile_square from "figma:asset/347fc7ee7a815779535f5264466cf573e0542bd2.png";
import maca_ghost_avatar_2_cute_square from "figma:asset/bdb7ba529b44198f72ba0789fa4cb98e973b976b.png";
import maca_ghost_avatar_3_amaze_square from "figma:asset/1a01a0838d75e3f5841daac723d44b5d014647fa.png";
import maca_ghost_avatar_4_plain_square from "figma:asset/f7afdf49f5c7c09b01252aeeedfd58ba5b1a8cfb.png";
import maca_ghost_avatar_5_confuse_square from "figma:asset/875b94185c088fb048cf2c61735c180c88c8e1e5.png";
import maca_ghost_avatar_6_sad_square from "figma:asset/553d3877a4d9177611e65a98367104cc5e90dc5d.png";

export const DEMO_AVATAR = maca_ghost_avatar_0_demo_square;

// User selectable avatars - Default avatar is index 0
export const USER_AVATARS = [
  maca_ghost_avatar_1_smile_square, // Default avatar for new users
  maca_ghost_avatar_2_cute_square,
  maca_ghost_avatar_3_amaze_square,
  maca_ghost_avatar_4_plain_square,
  maca_ghost_avatar_5_confuse_square,
  maca_ghost_avatar_6_sad_square,
];

export type AvatarType = string | null;
