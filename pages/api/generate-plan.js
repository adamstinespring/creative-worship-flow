import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import openai from '@/lib/openai';
import { generatePrompt } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { theme, userData, userId } = req.body;

  if (!theme || !userData || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const prompt = generatePrompt(userData, theme);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a worship service planning assistant. Create detailed, well-structured worship service plans.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const servicePlan = completion.choices[0].message.content;

    // Save to Firestore
    const planRef = await addDoc(collection(db, 'service_plans'), {
      userId,
      theme,
      service_plan: servicePlan,
      created_at: serverTimestamp(),
    });

    res.status(200).json({ success: true, planId: planRef.id });
  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ error: 'Failed to generate service plan' });
  }
}