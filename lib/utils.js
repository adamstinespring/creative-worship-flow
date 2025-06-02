import { format } from 'date-fns';

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const isTrialExpired = (trialEnd) => {
  return new Date() > new Date(trialEnd);
};

export const generatePrompt = (userData, theme) => {
  return `You are an experienced worship leader creating a seamless worship flow.

Theme: ${theme}
Worship Style: ${userData.worship_style}
Available Songs: ${userData.favorite_songs}
Service Structure: ${userData.service_structure}
Worship Philosophy: ${userData.worship_philosophy || 'Not specified'}
Congregation Notes: ${userData.congregation_notes || 'Not specified'}

Create a worship flow with exactly 5 songs around the theme "${theme}".

Use this EXACT format (no asterisks, no markdown, no bold text):

SONG 1: [Song Title]
Scripture: [Book chapter:verse] - [Full verse text]
Transition: [1-2 natural, conversational sentences that connect this scripture/moment to what's coming next without mentioning song titles]

SONG 2: [Song Title]
Scripture: [Book chapter:verse] - [Full verse text]
Transition: [1-2 natural, conversational sentences]

SONG 3: [Song Title]
Scripture: [Book chapter:verse] - [Full verse text]
Transition: [1-2 natural, conversational sentences]

SONG 4: [Song Title]
Scripture: [Book chapter:verse] - [Full verse text]
Transition: [1-2 natural, conversational sentences]

SONG 5: [Song Title]
Scripture: [Book chapter:verse] - [Full verse text]
Transition: [A brief closing thought that wraps up the worship time]

IMPORTANT: Use plain text only. No asterisks, no bold formatting, no markdown. Just clean, simple text.

Write transitions as if you're actually speaking to a congregation - warm, authentic, and purposeful.`;
};