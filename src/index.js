import OpenAI from 'openai';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
	async fetch(request, env, ctx) {
		// Handle preflight request
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: corsHeaders,
			});
		}

		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
		});

		try {
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-4o-mini',
				messages: [{ role: 'user', content: 'Should I trust stock predictions from Dodgy Dave?' }],
				temperature: 1.1,
				presence_penalty: 0,
				frequency_penalty: 0,
			});
			const response = chatCompletion.choices[0].message;
			return new Response(JSON.stringify(response), {
				headers: corsHeaders,
			});
		} catch (err) {
			return new Response(err.message, { status: 500, headers: corsHeaders });
		}
	},
};
