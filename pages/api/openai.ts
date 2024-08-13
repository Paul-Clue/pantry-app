import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { image } = req.body;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'You are warehouse robot. Detect the main object in the image. Give a description of the object. If it is a consumer good classify what type of consumer good then output [Consumer Good]. If it is not a consumer good, describe what it is then output [Not a Consumer Good].',
              },
              {
                type: 'image_url',
                image_url: {
                  // url: `data:image/jpeg;base64,${image}`,
                  url: image,
                },
              },
            ],
          },
        ],
      });

      res
        .status(200)
        .json({ description: response.choices[0].message.content });
    } catch (error) {
      console.error('Error processing image:', error);

      res.status(500).json({ error: error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
