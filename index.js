const axios = require('axios'); 
const cheerio = require('cheerio'); 
 
axios.get('https://scrapeme.live/shop/') 
	.then(({ data }) => { 
		const $ = cheerio.load(data); 
 
		const pokemons = $('li.product') 
			.map((_, pokemon) => { 
				const $pokemon = $(pokemon); 
				const name = $pokemon.find('.woocommerce-loop-product__title').text() 
				const price = $pokemon.find('.woocommerce-Price-amount').text() 
				return {'name': name, 'price': price} 
			}) 
			.toArray(); 
		console.log(pokemons) 
	});
