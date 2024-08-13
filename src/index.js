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

		// Handle POST request
		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: `Method ${request.method} Not Allowed` }), {
				status: 405,
				statusText: 'Method Not Allowed',
				headers: corsHeaders,
			});
		}

		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			baseURL: 'https://gateway.ai.cloudflare.com/v1/75ff1af9893e3ec9034d2b207f160b44/stock-predictions/openai',
		});

		try {
			const messages = await request.json();
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-4o-mini',
				messages,
				temperature: 1.1,
				presence_penalty: 0,
				frequency_penalty: 0,
			});
			const response = chatCompletion.choices[0].message;
			return new Response(JSON.stringify(response), {
				headers: corsHeaders,
			});
		} catch (err) {
			return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
		}
	},
};
