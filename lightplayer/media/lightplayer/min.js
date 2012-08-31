function Playlist(){}LightPlayer=function(){},LightPlayer.prototype={open:function(a){this.bus=$({}),this.json=a,this._render(),this._addMods(),this._addEvents(),this._animateIn(this.json.onOpen)},close:function(){var a=this;this._animateOut(function(){a.domRoot.remove()}),$(document).unbind("keydown.lightplayer")},add:function(a){var b=$.extend(!0,{},this.json);this.domRoot.find("div.widget").append(a.init(this.bus,b))},_addEvents:function(){var a=this;this.bus.bind("lightplayer-close",function(){a.close()}),this.domRoot.delegate("div.widget-container","click",function(b){b.target===this&&a.close()}),$(document).bind("keydown.lightplayer",function(b){b.which===27&&a.close()})},_addMods:function(){this.add(new Header),this.add(new Info),this.add(new Social),this.add(new Stage),this.add(new Playlist)},_animateIn:function(a){var b=this,c=this._getTransitionEndEvent(),d=this.domRoot.find("div.widget-overlay"),e=this.domRoot.find("div.widget");this._disablePageScroll(),d.bind(c,function(){e.bind(c,function(){e.css("-moz-transform","none"),b.bus.trigger("lightplayer-opened"),a&&a(),e.unbind(c)}),e.addClass("visible"),d.unbind(c)}),d.width(),d.addClass("visible"),b._hasTransitionSupport()||(e.css("-moz-transform","none"),e.addClass("visible"),this.bus.trigger("lightplayer-opened"))},_animateOut:function(a){var b=this,c=this._getTransitionEndEvent(),d=this.domRoot.find("div.widget-overlay"),e=this.domRoot.find("div.widget");e.bind(c,function(){d.bind(c,function(){a(),b._enablePageScroll()}),d.removeClass("visible")}),e.css("-moz-transform",""),this._hasTransitionSupport()||(a(),this._enablePageScroll()),e.removeClass("visible")},_disablePageScroll:function(){$.browser.msie&&$.browser.version<8&&$("html").css("overflow","hidden"),$("body").css({overflow:"hidden",paddingRight:"15px"})},_enablePageScroll:function(){$.browser.msie&&$.browser.version<8&&$("html").css("overflow",""),$("body").css({overflow:"",paddingRight:""})},_getTransitionEndEvent:function(){return $.browser.webkit?"webkitTransitionEnd":$.browser.opera?"oTransitionEnd":"transitionend"},_hasTransitionSupport:function(){var a=document.createElement("div"),b="Khtml Ms O Moz Webkit".split(" ");if("transition"in a.style)return!0;for(var c=0;c<b.length;c++)if(b[c]+"Transition"in a.style)return!0;return!1},_render:function(){var a=this.json.htmlClass||"";this.domRoot=$(['<div class="lightplayer '+a+'">','<div class="widget-container">','<div class="widget"></div>',"&nbsp;","</div>",'<div class="widget-overlay"></div>',"</div>"].join("")),this.domRoot.appendTo("body")}},jQuery.lightplayer={_instance:new LightPlayer,open:function(a){this._instance.open(a)},close:function(){this._instance.close()}},jQuery.extend(jQuery.easing,{easeOutBounce:function(a,b,c,d,e){return(b/=e)<1/2.75?d*7.5625*b*b+c:b<2/2.75?d*(7.5625*(b-=1.5/2.75)*b+.75)+c:b<2.5/2.75?d*(7.5625*(b-=2.25/2.75)*b+.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+.984375)+c}}),PubSub=function(){},PubSub.prototype={pub:function(a,b){this.bus.trigger({type:a,origin:this.name,json:$.extend(!0,{},b)})},sub:function(a,b){var c=this;this.bus.bind(a,function(a){a.origin!==c.name&&b(a)})}},ItensManager=function(){},ItensManager.prototype={_getItem:function(a){var b,c=this.json.itens,d=function(b){if(a==="current")return c[b];if(a==="next")return c[b+1];if(a==="prev")return c[b-1]};return $.each(c,function(a){if(this.current)return b=d(a),b&&(b.index=a),!1}),b},_getItemById:function(a){var b;return $.each(this.json.itens,function(){if(parseInt(this.id,10)===parseInt(a,10))return b=this,!1}),b},_setItemAsCurrent:function(a){var b=this.json.itens;$.each(b,function(){this.current=!1}),a.current=!0}},Mod=function(){},Mod.prototype=$.extend(new PubSub,new ItensManager,{init:function(a,b){return this.name="mod-name",this.bus=a,this.json=b,this._render(),this._addEvents(),this.domRoot},truncate:function(a,b){var c;return a?a.length>b?(a=a.substring(0,b),c=a.lastIndexOf(" "),a.substring(0,c)+"..."):a:a},_addEvents:function(){},_render:function(){}}),Header=function(){},Header.prototype=$.extend(new Mod,{init:function(a,b){return this.name="header",this.bus=a,this.json=b,this._render(),this._addEvents(),this.domRoot},_addEvents:function(){var a=this;this.domRoot.delegate("a.close","click",function(){a.pub("lightplayer-close")})},_render:function(){var a=this.json.title||"<span>mais</span> videos",b=this.json.subtitle||"";this.domRoot=$(['<div class="header">',"<h5>"+a+"</h5>",'<em class="subtitulo">'+b+"</em>",'<a href="javascript:;" class="close">fechar</a>',"</div>"].join(""))}}),Info=function(){},Info.prototype=$.extend(new Mod,{init:function(a,b){return this.name="info",this.bus=a,this.json=b,this._render(),this._addEvents(),this.domRoot},_addEvents:function(){var a=this;this.sub("video-change",function(b){a.json=b.json,a._updateItem()})},_render:function(){var a=this._getItem("current");this.domRoot=$(['<div class="info">','<span class="chapeu"></span>',"<h6></h6>","</div>"].join("")),this._updateItem()},_updateItem:function(){var a,b=this._getItem("current");this.domRoot.find("span.chapeu").html(b.hat||""),b.title.length>70?a={font:"bold 18px/20px Arial, sans-serif",marginTop:"8px"}:a={font:"bold 24px/26px Arial, sans-serif",marginTop:"0px"},this.domRoot.find("h6").css(a).html(this.truncate(b.title,90))}}),Playlist.prototype=$.extend(new Mod,{init:function(a,b){return this.name="playlist",this.bus=a,this.json=b,this.thumbHost=b.thumbHost||"http://img.video.globo.com",this.offset=0,this.json.itens.length>1&&(this._render(),this._addEvents()),this.domRoot},_addEvents:function(){var a=this;this.sub("video-change",function(b){var c,d;a.json=b.json,d=a._getItem("current"),c=a.domRoot.find("a[item-id="+d.id+"]"),a._setAsWatching(c.parent())}),this.domRoot.delegate("a.next:not(.inativo)","click",function(){a._goNext()}).delegate("a.prev:not(.inativo)","click",function(){a._goPrev()}).delegate("div.trilho-videos a","click",function(){var b=a._getItemById($(this).attr("item-id"));return a._setItemAsCurrent(b),a.pub("video-change",a.json),a._setAsWatching($(this).parent()),!1}),$(document).bind("keydown.lightplayer",function(b){b.shiftKey&&b.which===39&&a.domRoot.find("a.next").click(),b.shiftKey&&b.which===37&&a.domRoot.find("a.prev").click()})},_goNext:function(){var a=this.current.next();this.offset+=-parseInt(a.css("width"),10),this._move(),this._setCurrent(a),this._updateArrows()},_goPrev:function(){this.offset+=parseInt(this.current.css("width"),10),this._move(),this._setCurrent(this.current.prev()),this._updateArrows()},_move:function(a){this.domRoot.find("div.film-strip").css("margin-left",this.offset)},_render:function(){this._renderContainer(),this._renderItens(),this._setCurrent(this.domRoot.find("ul.current")),this._updateArrows()},_renderContainer:function(){this.domRoot=$(['<div class="playlist">','<a class="nav prev"></a>','<div class="trilho-videos"><div class="film-strip"></div></div>','<a class="nav next"></a>','<span class="borda-inferior"></span>',"</div>"].join(""))},_renderItens:function(){var a="<ul>",b=this;$.each(this.json.itens,function(c){a+=c>0&&c%4===0?"</ul><ul>":"",a+=["<li "+(this.current?'class="assistindo"':"")+">",'<a href="javascript:;" item-id="'+this.id+'" title="'+this.title+'">','<img src="'+b.thumbHost+"/180x108/"+this.id+'.jpg">','<span class="hover-img"></span>','<span class="layer"></span>','<span class="label">assistindo</span>',this.hat?'<span class="chapeu">'+this.hat+"</span>":"",'<span class="titulo-item">'+b.truncate(this.title,40)+"</span>",'<span class="exibicao"><strong>'+this.views+"</strong> exibições</span>","</a>","</li>"].join("")}),a+="</ul>",this.domRoot.find("div.film-strip").append(a)},_setAsWatching:function(a){this.domRoot.find("li.assistindo").removeClass("assistindo"),a.addClass("assistindo")},_setCurrent:function(a){a.size()===0?this.current=this.domRoot.find("ul:first").addClass("current"):(this.current.removeClass("current"),this.current=a.addClass("current"))},_updateArrows:function(){this.domRoot.find("a.nav").removeClass("inativo"),this.current.next().size()===0&&this.domRoot.find("a.next").addClass("inativo"),this.current.prev().size()===0&&this.domRoot.find("a.prev").addClass("inativo")}}),Social=function(){},Social.prototype=$.extend(new Mod,{init:function(a,b){return this.name="social",this.bus=a,this.json=b,this._render(),this._addEvents(),this.domRoot},_addEvents:function(){var a=this;this.sub("video-change",function(b){a.json=b.json,a._update()})},_clear:function(){this.domRoot.html("")},_render:function(){this._renderContainer(),this._renderContent()},_renderContainer:function(){this.domRoot=$(['<div class="social">',"</div>"].join(""))},_renderContent:function(){this._renderTitle(),this._renderTwitterButton(),this._renderFacebookButton(),this._renderOrkutButton()},_renderFacebookButton:function(){var a=this._getItem("current"),b=a.shortUrl||a.url;$("<a></a>",{href:"http://www.facebook.com/share.php?t="+encodeURIComponent(a.title)+"&u="+encodeURIComponent(b),"class":"facebook button",target:"_blank",title:"Compartilhe no Facebook"}).appendTo(this.domRoot)},_renderTitle:function(){this.domRoot.append(['<span class="label">compartilhe este vídeo</span>'].join(""))},_renderOrkutButton:function(){var a=this._getItem("current"),b=a.shortUrl||a.url;$("<a></a>",{href:"http://promote.orkut.com/preview?nt=orkut.com&tt="+encodeURI(a.title)+"&cn="+encodeURI(a.description)+"&du="+encodeURIComponent(b)+"&tn="+a.thumbUrl,"class":"orkut button",target:"_blank",title:"Compartilhe no Orkut"}).appendTo(this.domRoot)},_renderTwitterButton:function(){var a=this._getItem("current"),b=a.shortUrl||a.url;$("<a></a>",{href:"http://twitter.com?status="+encodeURIComponent(b+" "+a.title),"class":"twitter button",target:"_blank",title:"Compartilhe no Twitter"}).appendTo(this.domRoot)},_renderGloboInput:function(){var a=this._getItem("current");if(!a.shortUrl)return;$("<input />",{type:"text",value:a.shortUrl,readonly:"readonly","class":"globo-url"}).appendTo(this.domRoot)},_update:function(){var a=this._getItem("current");this._clear(),this._renderContent()}}),Stage=function(){},Stage.prototype=$.extend(new Mod,{init:function(a,b){return this.name="stage",this.bus=a,this.json=b,this.autoPlay=!1,this._render(),this._addEvents(),this.domRoot},_addEvents:function(){var a=this;this.sub("video-change",function(b){var c,d,e;c=a._getItem("current"),a.json=b.json,d=a._getItem("current"),d.index<c.index?a._simulatePrev():a._simulateNext()}),this.sub("lightplayer-opened",function(){a.json.autoPlay&&(a.autoPlay=!0,a.domRoot.find("li.current div.video-player").playerApiCaller("playVideo"))}),this.domRoot.delegate("a.nav.next","click",function(){a._goNext()}).delegate("a.nav.prev","click",function(){a._goPrev()}).delegate("a.nav:not(.loading)","mouseenter",function(){a._unfoldInfo($(this))}).delegate("a.nav:not(.loading)","mouseleave",function(){a._foldInfo($(this))}),$(document).bind("keydown.lightplayer",function(b){!b.shiftKey&&b.which===39&&a.domRoot.find("a.next.visible").click(),!b.shiftKey&&b.which===37&&a.domRoot.find("a.prev.visible").click()})},_addItem:function(a){var b=this._getItem(a)||{};return this.domRoot.find("ul").append(['<li id="item-'+b.id+'" class="'+a+'">','<div class="video-player"></div>',"</li>"].join("")),b},_animateArrow:function(){this.domRoot.find("a.nav.next.visible span.arrow").animate({right:"25px",opacity:1},200,function(){$(this).animate({right:"15px"},550,"easeOutBounce")})},_clear:function(){this.domRoot.find("li.current div.video-player").html("")},_foldInfo:function(a){a.stop().find("span.arrow").fadeTo(250,.2),a.stop().find("span.info").fadeOut(300,function(){a.stop().animate({width:0},250)})},_go:function(a){var b,c=this;this.domRoot.find("li.next, li.prev").remove(),b=this._addItem(a),this.domRoot.width(),a==="next"?(this.domRoot.find("li.current").removeClass("current").addClass("prev"),this.domRoot.find("li.next").removeClass("next").addClass("current")):(this.domRoot.find("li.current").removeClass("current").addClass("next"),this.domRoot.find("li.prev").removeClass("prev").addClass("current")),this._setItemAsCurrent(b)},_goNext:function(){var a=this._getItem("next")||{};this._clear(),this._go("next"),this._updateArrows(),this._updateItem(a),this.pub("video-change",this.json)},_goPrev:function(){var a=this._getItem("prev")||{};this._clear(),this._go("prev"),this._updateArrows(),this._updateItem(a),this.pub("video-change",this.json)},_onVideoCompleted:function(){var a;this.json.autoNext?this._goNext():(a=this.domRoot.find("a.nav.next.visible"),this._unfoldInfo(a))},_render:function(){var a=this._getItem("current")||{};this._renderRoot(),this._renderArrows(),this._addItem("current"),this._updateItem(a),this.json.itens.length==1&&this.domRoot.css("margin-bottom","30px")},_renderArrow:function(a){var b=a==="next"?"Próximo":"Anterior";this.domRoot.append(['<a href="javascript:;" class="nav '+a+' visible">','<span class="arrow"></span>','<span class="info">','<span class="chapeu">'+b+"</span>",'<span class="titulo"></span>',"</span>",'<span class="overlay"></span>',"</a>"].join(""))},_renderArrows:function(){this._renderArrow("next"),this._renderArrow("prev"),this._updateArrows()},_renderRoot:function(){this.domRoot=$(['<div class="palco">',"<ul></ul>","</div>"].join(""))},_simulateNext:function(){var a=this._getItem("prev");this._setItemAsCurrent(a),this._goNext()},_simulatePrev:function(){var a=this._getItem("next");this._setItemAsCurrent(a),this._goPrev()},_startArrowAnimation:function(){this._animateArrow(),this.timer=setInterval($.proxy(this,"_animateArrow"),1400)},_stopArrowAnimation:function(){clearInterval(this.timer)},_unfoldInfo:function(a){clearInterval(this.timer),a.stop().find("span.arrow").fadeTo(250,1),a.stop().animate({width:245},250,function(){a.find("span.info").fadeIn()})},_updateArrows:function(){var a=this.json.itens[0],b=this.json.itens[this.json.itens.length-1];this.domRoot.find("a.nav").removeClass("visible");if(a==b)return;a.current?this._updateNextArrow():b.current?this._updatePrevArrow():(this._updatePrevArrow(),this._updateNextArrow())},_updateItem:function(a){var b=this,c=this.json.mode==="sd"?480:640;this.domRoot.find("li.current div.video-player").width(c).player({videosIDs:a.id,autoPlay:this.autoPlay,sitePage:this.json.sitePage||"",width:c,height:360,complete:$.proxy(this,"_onVideoCompleted")})},_updateNextArrow:function(){var a=this._getItem("next")||{};this.domRoot.find("a.nav.next").addClass("visible").find("span.chapeu").html(a.hat||"").end().find("span.titulo").text(this.truncate(a.title,100))},_updatePrevArrow:function(){var a=this._getItem("prev")||{};this.domRoot.find("a.nav.prev").addClass("visible").find("span.chapeu").html(a.hat||"").end().find("span.titulo").text(a.title)}});