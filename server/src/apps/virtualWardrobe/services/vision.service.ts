import { fetchAI } from "@functions/fetchAI";
import fs from "fs";
import PocketBase from "pocketbase";
import sharp from "sharp";
import { z as zodV3 } from "zod";

export interface VisionAnalysisResult {
  name: string;
  category: string;
  subcategory: string;
  colors: string[];
}

export const analyzeClothingImages = async (
  pb: PocketBase,
  frontImagePath: string,
  backImagePath: string,
): Promise<VisionAnalysisResult> => {
  // Read and resize images
  const frontImageBuffer = fs.readFileSync(frontImagePath);

  const backImageBuffer = fs.readFileSync(backImagePath);

  const resizedFrontImageBuffer = await sharp(frontImageBuffer)
    .resize(1024)
    .toBuffer();

  const resizedBackImageBuffer = await sharp(backImageBuffer)
    .resize(1024)
    .toBuffer();

  const base64FrontImage = resizedFrontImageBuffer.toString("base64");

  const base64BackImage = resizedBackImageBuffer.toString("base64");

  // Define response structure
  const responseStructure = zodV3.object({
    name: zodV3.string(),
    category: zodV3.union([
      zodV3.literal("Tops"),
      zodV3.literal("Bottoms"),
      zodV3.literal("Dresses & Jumpsuits"),
      zodV3.literal("Footwear"),
      zodV3.literal("Accessories"),
      zodV3.literal("Activewear"),
      zodV3.literal("Formalwear"),
      zodV3.literal("Innerwear"),
      zodV3.literal("Sleepwear"),
      zodV3.literal("Traditional/Occasion Wear"),
      zodV3.literal("Outerwear"),
    ]),
    subcategory: zodV3.union([
      zodV3.literal("T-shirts"),
      zodV3.literal("Shirts"),
      zodV3.literal("Blouses"),
      zodV3.literal("Sweaters"),
      zodV3.literal("Hoodies"),
      zodV3.literal("Jackets"),
      zodV3.literal("Coats"),
      zodV3.literal("Tank Tops"),
      zodV3.literal("Jeans"),
      zodV3.literal("Trousers"),
      zodV3.literal("Shorts"),
      zodV3.literal("Skirts"),
      zodV3.literal("Leggings"),
      zodV3.literal("Joggers"),
      zodV3.literal("Dress Pants"),
      zodV3.literal("Casual Dresses"),
      zodV3.literal("Formal Dresses"),
      zodV3.literal("Maxi Dresses"),
      zodV3.literal("Jumpsuits"),
      zodV3.literal("Overalls"),
      zodV3.literal("Sneakers"),
      zodV3.literal("Sandals"),
      zodV3.literal("Boots"),
      zodV3.literal("Heels"),
      zodV3.literal("Loafers"),
      zodV3.literal("Flip-flops"),
      zodV3.literal("Slippers"),
      zodV3.literal("Hats & Caps"),
      zodV3.literal("Scarves"),
      zodV3.literal("Gloves"),
      zodV3.literal("Belts"),
      zodV3.literal("Watches"),
      zodV3.literal("Sunglasses"),
      zodV3.literal("Jewelry"),
      zodV3.literal("Sports T-shirts"),
      zodV3.literal("Leggings"),
      zodV3.literal("Running Shoes"),
      zodV3.literal("Gym Shorts"),
      zodV3.literal("Tracksuits"),
      zodV3.literal("Sports Bras"),
      zodV3.literal("Suits"),
      zodV3.literal("Blazers"),
      zodV3.literal("Dress Shirts"),
      zodV3.literal("Ties & Bowties"),
      zodV3.literal("Formal Shoes"),
      zodV3.literal("Underwear"),
      zodV3.literal("Socks"),
      zodV3.literal("Bras"),
      zodV3.literal("Thermals"),
      zodV3.literal("Pajamas"),
      zodV3.literal("Nightgowns"),
      zodV3.literal("Robes"),
      zodV3.literal("Cultural Attire"),
      zodV3.literal("Wedding Dresses"),
      zodV3.literal("Festive Wear"),
      zodV3.literal("Raincoats"),
      zodV3.literal("Parkas"),
      zodV3.literal("Windbreakers"),
      zodV3.literal("Puffer Jackets"),
    ]),
    colors: zodV3.array(
      zodV3.union([
        zodV3.literal("Black"),
        zodV3.literal("White"),
        zodV3.literal("Gray"),
        zodV3.literal("Red"),
        zodV3.literal("Blue"),
        zodV3.literal("Green"),
        zodV3.literal("Yellow"),
        zodV3.literal("Orange"),
        zodV3.literal("Purple"),
        zodV3.literal("Pink"),
        zodV3.literal("Brown"),
        zodV3.literal("Beige"),
        zodV3.literal("Navy"),
        zodV3.literal("Teal"),
        zodV3.literal("Maroon"),
        zodV3.literal("Olive"),
        zodV3.literal("Turquoise"),
        zodV3.literal("Coral"),
        zodV3.literal("Mint"),
        zodV3.literal("Lavender"),
        zodV3.literal("Cream"),
        zodV3.literal("Tan"),
        zodV3.literal("Khaki"),
        zodV3.literal("Burgundy"),
        zodV3.literal("Magenta"),
        zodV3.literal("Cyan"),
        zodV3.literal("Lime"),
        zodV3.literal("Rose"),
        zodV3.literal("Salmon"),
        zodV3.literal("Peach"),
        zodV3.literal("Gold"),
        zodV3.literal("Silver"),
      ]),
    ),
  });

  const response = await fetchAI({
    pb,
    provider: "openai",
    model: "gpt-4o-mini",
    structure: responseStructure,
    messages: [
      {
        role: "system",
        content: `Given the front and back images, please provide the name, category, subcategory, and colors of the clothing item. There could be more than one color.
          
          Note that the groupings between categories and subcategories are as follows:
          - Tops: T-shirts, Shirts, Blouses, Sweaters, Hoodies, Jackets, Coats, Tank Tops
          - Bottoms: Jeans, Trousers, Shorts, Skirts, Leggings, Joggers, Dress Pants
          - Dresses & Jumpsuits: Casual Dresses, Formal Dresses, Maxi Dresses, Jumpsuits, Overalls
          - Footwear: Sneakers, Sandals, Boots, Heels, Loafers, Flip-flops, Slippers
          - Accessories: Hats & Caps, Scarves, Gloves, Belts, Watches, Sunglasses, Jewelry
          - Activewear: Sports T-shirts, Leggings, Running Shoes, Gym Shorts, Tracksuits, Sports Bras
          - Formalwear: Suits, Blazers, Dress Shirts, Ties & Bowties, Formal Shoes
          - Innerwear: Underwear, Socks, Bras, Thermals
          - Sleepwear: Pajamas, Nightgowns, Robes
          - Traditional/Occasion Wear: Cultural Attire, Wedding Dresses, Festive Wear
          - Outerwear: Raincoats, Parkas, Windbreakers, Puffer Jackets
          `,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64FrontImage}` },
          },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64BackImage}` },
          },
        ],
      },
    ],
  });

  if (!response) {
    throw new Error("Failed to process image");
  }

  return response;
};
