function Playlist(){}LightPlayer=function(){},LightPlayer.prototype={open:function(e){this.bus=$({}),this.json=e,this._render(),this._addMods(),this._addEvents(),this._animateIn(this.json.onOpen)},close:function(){var e=this;this._animateOut(function(){e.domRoot.remove()}),$(document).unbind("keydown.lightplayer")},add:function(e){var t=$.extend(!0,{},this.json);this.domRoot.find("div.widget").append(e.init(this.bus,t))},_addEvents:function(){var e=this;this.bus.bind("lightplayer-close",function(){e.close()}),this.domRoot.delegate("div.widget-container","click",function(t){t.target===this&&e.close()}),$(document).bind("keydown.lightplayer",function(t){t.which===27&&e.close()})},_addMods:function(){this.add(new Header),this.add(new Info),this.add(new Social),this.add(new Stage),this.add(new Playlist)},_animateIn:function(e){var t=this,n=this._getTransitionEndEvent(),r=this.domRoot.find("div.widget-overlay"),i=this.domRoot.find("div.widget");this._disablePageScroll(),r.bind(n,function(){i.bind(n,function(){i.css("-moz-transform","none"),t.bus.trigger("lightplayer-opened"),e&&e.call(t),i.unbind(n)}),i.addClass("visible"),r.unbind(n)}),r.width(),r.addClass("visible"),t._hasTransitionSupport()||(i.css("-moz-transform","none"),i.addClass("visible"),this.bus.trigger("lightplayer-opened"))},_animateOut:function(e){var t=this,n=this._getTransitionEndEvent(),r=this.domRoot.find("div.widget-overlay"),i=this.domRoot.find("div.widget");i.bind(n,function(){r.bind(n,function(){e(),t._enablePageScroll()}),r.removeClass("visible")}),i.css("-moz-transform",""),this._hasTransitionSupport()||(e(),this._enablePageScroll()),i.removeClass("visible")},_disablePageScroll:function(){$.browser.msie&&$.browser.version<8&&$("html").css("overflow","hidden"),$("body").css({overflow:"hidden",paddingRight:"15px"})},_enablePageScroll:function(){$.browser.msie&&$.browser.version<8&&$("html").css("overflow",""),$("body").css({overflow:"",paddingRight:""})},_getTransitionEndEvent:function(){return $.browser.webkit||$.browser.chrome?"webkitTransitionEnd":$.browser.opera?"oTransitionEnd":"transitionend"},_hasTransitionSupport:function(){var e=document.createElement("div"),t="Khtml Ms O Moz Webkit".split(" ");if("transition"in e.style)return!0;for(var n=0;n<t.length;n++)if(t[n]+"Transition"in e.style)return!0;return!1},_render:function(){var e=this.json.htmlClass||"";this.domRoot=$(['<div class="lightplayer '+e+'">','<div class="widget-container">','<div class="widget"></div>',"&nbsp;","</div>",'<div class="widget-overlay"></div>',"</div>"].join("")),this.domRoot.appendTo("body")}},jQuery.lightplayer={_instance:new LightPlayer,open:function(e){this._instance.open(e)},close:function(){this._instance.close()}},jQuery.extend(jQuery.easing,{easeOutBounce:function(e,t,n,r,i){return(t/=i)<1/2.75?r*7.5625*t*t+n:t<2/2.75?r*(7.5625*(t-=1.5/2.75)*t+.75)+n:t<2.5/2.75?r*(7.5625*(t-=2.25/2.75)*t+.9375)+n:r*(7.5625*(t-=2.625/2.75)*t+.984375)+n}}),PubSub=function(){},PubSub.prototype={pub:function(e,t){this.bus.trigger({type:e,origin:this.name,json:$.extend(!0,{},t)})},sub:function(e,t){var n=this;this.bus.bind(e,function(e){e.origin!==n.name&&t(e)})}},ItensManager=function(){},ItensManager.prototype={_getItem:function(e){var t,n=this.json.itens,r=function(t){if(e==="current")return n[t];if(e==="next")return n[t+1];if(e==="prev")return n[t-1]};return $.each(n,function(e){if(this.current)return t=r(e),t&&(t.index=e),!1}),t},_getItemById:function(e){var t;return $.each(this.json.itens,function(){if(parseInt(this.id,10)===parseInt(e,10))return t=this,!1}),t},_setItemAsCurrent:function(e){var t=this.json.itens;$.each(t,function(){this.current=!1}),e.current=!0}},Mod=function(){},Mod.prototype=$.extend(new PubSub,new ItensManager,{init:function(e,t){return this.name="mod-name",this.bus=e,this.json=t,this._render(),this._addEvents(),this.domRoot},truncate:function(e,t){var n;return e?e.length>t?(e=e.substring(0,t),n=e.lastIndexOf(" "),e.substring(0,n)+"..."):e:e},_addEvents:function(){},_render:function(){}}),Header=function(){},Header.prototype=$.extend(new Mod,{init:function(e,t){return this.name="header",this.bus=e,this.json=t,this._render(),this._addEvents(),this.domRoot},_addEvents:function(){var e=this;this.domRoot.delegate("a.close","click",function(){e.pub("lightplayer-close")})},_render:function(){var e=this.json.title||"<span>mais</span> videos",t=this.json.subtitle||"";this.domRoot=$(['<div class="header">',"<h5>"+e+"</h5>",'<em class="subtitulo">'+t+"</em>",'<a href="javascript:;" class="close">fechar</a>',"</div>"].join(""))}}),Info=function(){},Info.prototype=$.extend(new Mod,{init:function(e,t){return this.name="info",this.bus=e,this.json=t,this._render(),this._addEvents(),this.domRoot},_addEvents:function(){var e=this;this.sub("video-change",function(t){e.json=t.json,e._updateItem()})},_render:function(){var e=this._getItem("current");this.domRoot=$(['<div class="info">','<span class="chapeu"></span>',"<h6></h6>","</div>"].join("")),this._updateItem()},_updateItem:function(){var e,t=this._getItem("current");this.domRoot.find("span.chapeu").html(t.hat||""),t.title.length>70?e={font:"bold 18px/20px Arial, sans-serif",marginTop:"8px"}:e={font:"bold 24px/26px Arial, sans-serif",marginTop:"0px"},this.domRoot.find("h6").css(e).html(this.truncate(t.title,90))}}),Playlist.prototype=$.extend(new Mod,{init:function(e,t){return this.name="playlist",this.bus=e,this.json=t,this.thumbHost=t.thumbHost||"http://img.video.globo.com",this.offset=0,this.json.itens.length>1&&(this._render(),this._addEvents()),this.domRoot},_addEvents:function(){var e=this;this.sub("video-change",function(t){var n,r;e.json=t.json,r=e._getItem("current"),n=e.domRoot.find("a[item-id="+r.id+"]"),e._setAsWatching(n.parent())}),this.domRoot.delegate("a.next:not(.inativo)","click",function(){e._goNext()}).delegate("a.prev:not(.inativo)","click",function(){e._goPrev()}).delegate("div.trilho-videos a","click",function(){var t=e._getItemById($(this).attr("item-id"));return e._setItemAsCurrent(t),e.pub("video-change",e.json),e._setAsWatching($(this).parent()),!1}),$(document).bind("keydown.lightplayer",function(t){t.shiftKey&&t.which===39&&e.domRoot.find("a.next").click(),t.shiftKey&&t.which===37&&e.domRoot.find("a.prev").click()})},_goNext:function(){var e=this.current.next();this.offset+=-parseInt(e.css("width"),10),this._move(),this._setCurrent(e),this._updateArrows()},_goPrev:function(){this.offset+=parseInt(this.current.css("width"),10),this._move(),this._setCurrent(this.current.prev()),this._updateArrows()},_move:function(e){this.domRoot.find("div.film-strip").css("margin-left",this.offset)},_render:function(){this._renderContainer(),this._renderItens(),this._setCurrent(this.domRoot.find("ul.current")),this._updateArrows()},_renderContainer:function(){this.domRoot=$(['<div class="playlist">','<a class="nav prev"></a>','<div class="trilho-videos"><div class="film-strip"></div></div>','<a class="nav next"></a>','<span class="borda-inferior"></span>',"</div>"].join(""))},_renderItens:function(){var e="<ul>",t=this;$.each(this.json.itens,function(n){e+=n>0&&n%4===0?"</ul><ul>":"",e+=["<li "+(this.current?'class="assistindo"':"")+">",'<a href="javascript:;" item-id="'+this.id+'" title="'+this.title+'">','<img src="'+t.thumbHost+"/180x108/"+this.id+'.jpg">','<span class="hover-img"></span>','<span class="layer"></span>','<span class="label">assistindo</span>',this.hat?'<span class="chapeu">'+this.hat+"</span>":"",'<span class="titulo-item">'+t.truncate(this.title,40)+"</span>",'<span class="exibicao"><strong>'+this.views+"</strong> exibições</span>","</a>","</li>"].join("")}),e+="</ul>",this.domRoot.find("div.film-strip").append(e)},_setAsWatching:function(e){this.domRoot.find("li.assistindo").removeClass("assistindo"),e.addClass("assistindo")},_setCurrent:function(e){e.size()===0?this.current=this.domRoot.find("ul:first").addClass("current"):(this.current.removeClass("current"),this.current=e.addClass("current"))},_updateArrows:function(){this.domRoot.find("a.nav").removeClass("inativo"),this.current.next().size()===0&&this.domRoot.find("a.next").addClass("inativo"),this.current.prev().size()===0&&this.domRoot.find("a.prev").addClass("inativo")}}),Social=function(){},Social.prototype=$.extend(new Mod,{init:function(e,t){return this.name="social",this.bus=e,this.json=t,this._render(),this._addEvents(),this.domRoot},_addEvents:function(){var e=this;this.sub("video-change",function(t){e.json=t.json,e._update()})},_clear:function(){this.domRoot.html("")},_render:function(){this._renderContainer(),this._renderContent()},_renderContainer:function(){this.domRoot=$(['<div class="social">',"</div>"].join(""))},_renderContent:function(){this._renderTitle(),this._renderTwitterButton(),this._renderFacebookButton(),this._renderOrkutButton()},_renderFacebookButton:function(){var e=this._getItem("current"),t=e.shortUrl||e.url;$("<a></a>",{href:"http://www.facebook.com/share.php?t="+encodeURIComponent(e.title)+"&u="+encodeURIComponent(t),"class":"facebook button",target:"_blank",title:"Compartilhe no Facebook"}).appendTo(this.domRoot)},_renderTitle:function(){this.domRoot.append(['<span class="label">compartilhe este vídeo</span>'].join(""))},_renderOrkutButton:function(){var e=this._getItem("current"),t=e.shortUrl||e.url;$("<a></a>",{href:"http://promote.orkut.com/preview?nt=orkut.com&tt="+encodeURI(e.title)+"&cn="+encodeURI(e.description)+"&du="+encodeURIComponent(t)+"&tn="+e.thumbUrl,"class":"orkut button",target:"_blank",title:"Compartilhe no Orkut"}).appendTo(this.domRoot)},_renderTwitterButton:function(){var e=this._getItem("current"),t=e.shortUrl||e.url;$("<a></a>",{href:"http://twitter.com?status="+encodeURIComponent(t+" "+e.title),"class":"twitter button",target:"_blank",title:"Compartilhe no Twitter"}).appendTo(this.domRoot)},_renderGloboInput:function(){var e=this._getItem("current");if(!e.shortUrl)return;$("<input />",{type:"text",value:e.shortUrl,readonly:"readonly","class":"globo-url"}).appendTo(this.domRoot)},_update:function(){var e=this._getItem("current");this._clear(),this._renderContent()}}),Stage=function(){},Stage.prototype=$.extend(new Mod,{init:function(e,t){return this.name="stage",this.bus=e,this.json=t,this.autoPlay=!1,this._render(),this._addEvents(),this.domRoot},_addEvents:function(){var e=this;this.sub("video-change",function(t){var n,r,i;n=e._getItem("current"),e.json=t.json,r=e._getItem("current"),r.index<n.index?e._simulatePrev():e._simulateNext()}),this.sub("lightplayer-opened",function(){e.json.autoPlay&&(e.autoPlay=!0,e.domRoot.find("li.current div.video-player").playerApiCaller("playVideo"))}),this.domRoot.delegate("a.nav.next","click",function(){e._goNext()}).delegate("a.nav.prev","click",function(){e._goPrev()}).delegate("a.nav:not(.loading)","mouseenter",function(){e._unfoldInfo($(this))}).delegate("a.nav:not(.loading)","mouseleave",function(){e._foldInfo($(this))}),$(document).bind("keydown.lightplayer",function(t){!t.shiftKey&&t.which===39&&e.domRoot.find("a.next.visible").click(),!t.shiftKey&&t.which===37&&e.domRoot.find("a.prev.visible").click()})},_addItem:function(e){var t=this._getItem(e)||{};return this.domRoot.find("ul").append(['<li id="item-'+t.id+'" class="'+e+'">','<div class="video-player"></div>',"</li>"].join("")),t},_animateArrow:function(){this.domRoot.find("a.nav.next.visible span.arrow").animate({right:"25px",opacity:1},200,function(){$(this).animate({right:"15px"},550,"easeOutBounce")})},_clear:function(){this.domRoot.find("li.current div.video-player").html("")},_foldInfo:function(e){e.stop().find("span.arrow").fadeTo(250,.2),e.stop().find("span.info").fadeOut(300,function(){e.stop().animate({width:0},250)})},_go:function(e){var t,n=this;this.domRoot.find("li.next, li.prev").remove(),t=this._addItem(e),this.domRoot.width(),e==="next"?(this.domRoot.find("li.current").removeClass("current").addClass("prev"),this.domRoot.find("li.next").removeClass("next").addClass("current")):(this.domRoot.find("li.current").removeClass("current").addClass("next"),this.domRoot.find("li.prev").removeClass("prev").addClass("current")),this._setItemAsCurrent(t)},_goNext:function(){var e=this._getItem("next")||{};this._clear(),this._go("next"),this._updateArrows(),this._updateItem(e),this.pub("video-change",this.json)},_goPrev:function(){var e=this._getItem("prev")||{};this._clear(),this._go("prev"),this._updateArrows(),this._updateItem(e),this.pub("video-change",this.json)},_onVideoCompleted:function(){var e;this.json.autoNext?this._goNext():(e=this.domRoot.find("a.nav.next.visible"),this._unfoldInfo(e))},_render:function(){var e=this._getItem("current")||{};this._renderRoot(),this._renderArrows(),this._addItem("current"),this._updateItem(e),this.json.itens.length==1&&this.domRoot.css("margin-bottom","30px")},_renderArrow:function(e){var t=e==="next"?"Próximo":"Anterior";this.domRoot.append(['<a href="javascript:;" class="nav '+e+' visible">','<span class="arrow"></span>','<span class="info">','<span class="chapeu">'+t+"</span>",'<span class="titulo"></span>',"</span>",'<span class="overlay"></span>',"</a>"].join(""))},_renderArrows:function(){this._renderArrow("next"),this._renderArrow("prev"),this._updateArrows()},_renderRoot:function(){this.domRoot=$(['<div class="palco">',"<ul></ul>","</div>"].join(""))},_simulateNext:function(){var e=this._getItem("prev");this._setItemAsCurrent(e),this._goNext()},_simulatePrev:function(){var e=this._getItem("next");this._setItemAsCurrent(e),this._goPrev()},_startArrowAnimation:function(){this._animateArrow(),this.timer=setInterval($.proxy(this,"_animateArrow"),1400)},_stopArrowAnimation:function(){clearInterval(this.timer)},_unfoldInfo:function(e){clearInterval(this.timer),e.stop().find("span.arrow").fadeTo(250,1),e.stop().animate({width:245},250,function(){e.find("span.info").fadeIn()})},_updateArrows:function(){var e=this.json.itens[0],t=this.json.itens[this.json.itens.length-1];this.domRoot.find("a.nav").removeClass("visible");if(e==t)return;e.current?this._updateNextArrow():t.current?this._updatePrevArrow():(this._updatePrevArrow(),this._updateNextArrow())},_updateItem:function(e){var t=this,n=this.json.mode==="sd"?480:640;this.domRoot.find("li.current div.video-player").width(n).player({videosIDs:e.id,autoPlay:this.autoPlay,sitePage:this.json.sitePage||"",width:n,height:360,complete:$.proxy(this,"_onVideoCompleted")})},_updateNextArrow:function(){var e=this._getItem("next")||{};this.domRoot.find("a.nav.next").addClass("visible").find("span.chapeu").html(e.hat||"").end().find("span.titulo").text(this.truncate(e.title,100))},_updatePrevArrow:function(){var e=this._getItem("prev")||{};this.domRoot.find("a.nav.prev").addClass("visible").find("span.chapeu").html(e.hat||"").end().find("span.titulo").text(e.title)}});