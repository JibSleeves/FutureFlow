
'use server';
/**
 * @fileOverview Generates descriptive details for a mystical sigil based on user intention
 * and chosen symbolic system (Astrological or Runic).
 * Includes a Harmonic Attunement Phrase for the sigil.
 *
 * - generateSigil - A function that returns sigil details.
 * - GenerateSigilInput - The input type for the function.
 * - GenerateSigilOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSigilInputSchema = z.object({
  intention: z.string().describe('The user\'s core intention or purpose for the sigil.'),
  sigilSystem: z.enum(['astrological', 'runic']).describe('The chosen symbolic system for the sigil.'),
  specificType: z.string().describe('The specific archetype or style within the chosen system (e.g., "Solar Empowerment Sigil" or "Ancient Line Bindrune").'),
});
export type GenerateSigilInput = z.infer<typeof GenerateSigilInputSchema>;

const GenerateSigilOutputSchema = z.object({
  sigilName: z.string().describe('A mystical and evocative name for the generated sigil.'),
  description: z.string().describe('A detailed visual description of the sigil\'s appearance, as if instructing someone how to draw or visualize it.'),
  symbolism: z.string().describe('An explanation of the metaphysical and symbolic meaning behind the sigil\'s design elements and how they relate to the intention and chosen type.'),
  usageSuggestion: z.string().describe('A brief suggestion for how the user might activate, meditate upon, or utilize this sigil.'),
  visualizationSeed: z.string().describe('A short (3-7 words) evocative phrase suitable for an AI image generator to create a visual representation of this sigil. Should be concise and highly symbolic.'),
  harmonicAttunementPhrase: z.string().describe('A short (3-7 words) mantra or affirmation specifically crafted to resonate with the sigil\'s intention and symbolism, for meditation or spoken activation.'),
});
export type GenerateSigilOutput = z.infer<typeof GenerateSigilOutputSchema>;

export async function generateSigil(input: GenerateSigilInput): Promise<GenerateSigilOutput> {
  return generateSigilFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSigilPrompt',
  input: {schema: GenerateSigilInputSchema},
  output: {schema: GenerateSigilOutputSchema},
  prompt: `You are AstraKairos, an oracle of symbolic wisdom, specializing in the creation of potent sigils.
The user seeks a sigil for the following intention: "{{intention}}"

They have chosen the following sigil system: {{sigilSystem}}
And the specific archetype/style: "{{specificType}}"

{{#if (eq sigilSystem "astrological")}}
  You will craft an ASTROLOGICAL SIGIL. This sigil draws power from cosmic alignments and planetary energies.
  The archetype is "{{specificType}}".
  These are the available archetypes and their focus:
  - "Solar Empowerment Sigil": Focus on vitality, self-expression, radiance, personal power. Symbols might include suns, lions, gold, radiating lines.
  - "Lunar Intuition Glyph": Focus on emotion, dreams, subconscious, hidden knowledge, cycles. Symbols might include crescents, water, silver, spirals, cups.
  - "Stellar Destiny Mark": Focus on guidance, higher purpose, cosmic connection, aspiration. Symbols might include stars, constellations, compasses, eyes, deep blues/purples.
  - "Planetary Harmony Cipher": Focus on balance, relationships, specific planetary virtues (e.g., Mercury for communication, Venus for love). Symbols related to the chosen planet or balanced geometric forms.
  - "Elemental Core Brand": Focus on grounding, transformation, primal energies (Earth, Air, Fire, Water). Symbols representing the chosen element.

  Based on the user's intention and the chosen archetype "{{specificType}}", generate the following:
  - sigilName: A mystical and evocative name for this astrological sigil (3-5 words).
  - description: A detailed visual description of the sigil's appearance. Describe its lines, shapes, and any included symbols as if instructing someone how to draw or visualize it. Be creative and evocative.
  - symbolism: Explain the deeper metaphysical and astrological symbolism behind the sigil's design elements and how they relate to the user's intention and the "{{specificType}}".
  - usageSuggestion: A brief, actionable suggestion for how the user might activate or meditate upon this sigil (e.g., "Visualize this sigil under the light of the full moon to enhance intuitive clarity.").
  - visualizationSeed: A short (3-7 words) evocative phrase for an AI image generator to create a visual representation of this sigil. Example: "Radiant Sun Lion Emblem". Ensure this is distinct and highly symbolic.
  - harmonicAttunementPhrase: A short (3-7 words) mantra or affirmation specifically crafted to resonate with this sigil's intention and symbolism. Example: "My power shines, my path unfolds."
{{/if}}

{{#if (eq sigilSystem "runic")}}
  You will craft a RUNIC SIGIL or BINDURNE. This sigil draws from ancient letterforms or abstract symbolic shapes.
  The style is "{{specificType}}".
  These are the available styles and their focus:
  - "Ancient Line Bindrune": Combine abstract lines and simple geometric shapes (inspired by runic staves) to form a cohesive symbol. Focus on flowing or stark geometric energy. The design should feel ancient and potent.
  - "Mystical Script Seal": Imagine letters or abstract script-like marks woven into a compact design, perhaps resembling a magical seal or monogram. The script should feel otherworldly.
  - "Abstract Energy Glyph": A more modern, minimalist take. Create a simple yet powerful abstract mark that embodies the intention through pure form and energy, less tied to traditional letterforms.

  Based on the user's intention and the chosen style "{{specificType}}", generate the following:
  - sigilName: A mystical and evocative name for this runic sigil/form (3-5 words).
  - description: A detailed visual description of the sigil's appearance. Describe its lines, curves, intersections, and overall form. If based on script, describe the character of the script. Be creative and evocative.
  - symbolism: Explain the symbolic meaning of the forms chosen, and how they relate to the user's intention and the "{{specificType}}".
  - usageSuggestion: A brief, actionable suggestion for how the user might activate or meditate upon this sigil (e.g., "Trace this bindrune in the air to invoke its protective qualities.").
  - visualizationSeed: A short (3-7 words) evocative phrase for an AI image generator to create a visual representation of this sigil. Example: "Interwoven Lines Power Seal". Ensure this is distinct and highly symbolic.
  - harmonicAttunementPhrase: A short (3-7 words) mantra or affirmation specifically crafted to resonate with this sigil's intention and symbolism. Example: "My will takes form, my strength endures."
{{/if}}
`,
});

const generateSigilFlow = ai.defineFlow(
  {
    name: 'generateSigilFlow',
    inputSchema: GenerateSigilInputSchema,
    outputSchema: GenerateSigilOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AstraKairos failed to generate the sigil. The symbolic currents are obscured.");
    }
    return output;
  }
);

    
