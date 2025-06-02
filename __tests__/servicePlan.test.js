import { generatePrompt } from '@/lib/utils';

describe('Service Plan Generation', () => {
  test('should generate proper prompt with all user data', () => {
    const userData = {
      worship_style: 'Contemporary',
      favorite_songs: 'Amazing Grace\nHow Great Thou Art',
      service_structure: 'Welcome, Worship, Word, Response',
      worship_philosophy: 'Focus on congregational participation',
      congregation_notes: 'Mixed age group',
    };

    const theme = 'Hope and Faith';
    const prompt = generatePrompt(userData, theme);

    expect(prompt).toContain('Theme: Hope and Faith');
    expect(prompt).toContain('Worship Style: Contemporary');
    expect(prompt).toContain('Amazing Grace');
    expect(prompt).toContain('Focus on congregational participation');
  });

  test('should handle optional fields', () => {
    const userData = {
      worship_style: 'Traditional',
      favorite_songs: 'Hymns',
      service_structure: 'Standard liturgy',
    };

    const theme = 'Grace';
    const prompt = generatePrompt(userData, theme);

    expect(prompt).toContain('Not specified');
  });
});
