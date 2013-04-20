/*globals Social */

/***********************************************
 * MODULO SOCIAL
 ***********************************************/

describe("Module: Social", function () {
	beforeEach(function () {
		this.client = new LiteMQ.Client({name:'test-suite'});
		this.json = {
			itens: [
				{
					id: 123,
					title: 'titulo 1',
					description: 'desc 1',
					views: 1000,
					url: 'http://www.globo.com/slug/item-1/',
					shortUrl: 'http://glo.bo/11111',
					thumbUrl: 'thumb.jpg',
					current: true
				},
				{
					id: 456,
					title: 'titulo 2',
					description: 'desc 2',
					views: 2000,
					url: 'http://www.globo.com/slug/item-2/',
					shortUrl: 'http://glo.bo/22222',
					thumbUrl: 'thumb2.jpg'
				},
				{
					id: 789,
					title: 'titulo 3',
					description: 'desc 3',
					views: 3000,
					url: 'http://www.globo.com/slug/item-3/',
					thumbUrl: 'thumb3.jpg'
				}
			]
		};

		this.social = new Social(this.json);
	});

	it("should have a name", function () {
		this.social.init(this.json);

		expect(this.social.name).toBe('social');
	});

	it("should have a container", function () {
		expect(this.social.domRoot.size()).toBe(1);
		expect(this.social.domRoot).toHaveClass('social');
	});
	
	describe("twitter", function () {
		it("should have a twitter share button", function () {
			expect(this.social.domRoot.find('a.twitter.button').size()).toBe(1);
		});

		it("should have a twitter share button with shorten url", function () {
			var encodedUrl = encodeURIComponent(this.json.itens[0].shortUrl);
			expect(this.social.domRoot.find('a.twitter.button').attr('href')).toContain(encodedUrl);
		});

		it("should use the regular url if shorten url is not provided", function () {
			var encodedUrl;
			
			delete this.json.itens[0].shortUrl;

			this.social = new Social(this.json); 

			encodedUrl = encodeURIComponent(this.json.itens[0].url);

			expect(this.social.domRoot.find('a.twitter.button').attr('href')).toContain(encodedUrl);
		});

		it("should have a twitter share button with title", function () {
			var encodedTitle = encodeURIComponent(this.json.itens[0].title);

			expect(this.social.domRoot.find('a.twitter.button').attr('href')).toContain(encodedTitle);
		});

	});
	 
	describe("facebook", function () {

		it("should have a facebook share button", function () {
			expect(this.social.domRoot.find('a.facebook.button').size()).toBe(1);
		});

		it("should have a facebook share button with shorten url", function () {
			var encodedUrl = encodeURIComponent(this.json.itens[0].shortUrl);
			expect(this.social.domRoot.find('a.facebook.button').attr('href')).toContain(encodedUrl);
		});

		it("should use the regular url if shorten url is not provided", function () {
			var encodedUrl;
			
			delete this.json.itens[0].shortUrl;

			encodedUrl = encodeURIComponent(this.json.itens[0].url);

			this.social = new Social(this.json); 

			expect(this.social.domRoot.find('a.facebook.button').attr('href')).toContain(encodedUrl);
		});
		
		it("should have a facebook share button with title", function () {
			var encodedTitle = encodeURIComponent(this.json.itens[0].title);

			expect(this.social.domRoot.find('a.facebook.button').attr('href')).toContain(encodedTitle);
		});
	});

	describe("orkut", function () {
		it("should have an orkut share button", function () {
			expect(this.social.domRoot.find('a.orkut.button').size()).toBe(1);
		});

		it("should have a orkut share button with shorten url", function () {
			var encodedUrl = encodeURIComponent(this.json.itens[0].shortUrl);
			expect(this.social.domRoot.find('a.orkut.button').attr('href')).toContain(encodedUrl);
		});

		it("should use the regular url if shorten url is not provided", function () {
			var encodedUrl;

			delete this.json.itens[0].shortUrl;

			encodedUrl = encodeURIComponent(this.json.itens[0].url);

			this.social = new Social(this.json); 

			expect(this.social.domRoot.find('a.orkut.button').attr('href')).toContain(encodedUrl);
		});

		it("should have an orkut share button with title", function () {
			expect(this.social.domRoot.find('a.orkut.button').attr('href')).toContain(encodeURI(this.json.itens[0].title));
		});

		it("should have an orkut share button with thumb url", function () {
			expect(this.social.domRoot.find('a.orkut.button').attr('href')).toContain(this.json.itens[0].thumbUrl);
		});
	});

	describe("Events", function () {
		beforeEach(function () {
			this.json.itens[0].current = false;
			this.json.itens[2].current = true;
			
			this.client.pub('video-change', this.json);
		});
		
		it("should change twitter button url on video-change", function () {
			var encodedUrl = encodeURIComponent(this.json.itens[2].url);
			expect(this.social.domRoot.find('a.twitter.button').attr('href')).toContain(encodedUrl);
		});

		it("should change facebook button url on video-change", function () {
			var encodedUrl = encodeURIComponent(this.json.itens[2].url);
			expect(this.social.domRoot.find('a.facebook.button').attr('href')).toContain(encodedUrl);
		});

		it("should change orkut button url on video-change", function () {
			var encodedUrl = encodeURIComponent(this.json.itens[2].url);
			expect(this.social.domRoot.find('a.orkut.button').attr('href')).toContain(encodedUrl);
		});
	});
});


