(this.webpackJsonpdragndrop=this.webpackJsonpdragndrop||[]).push([[0],{47:function(e,n,t){},52:function(e,n,t){"use strict";t.r(n);var r,i,c,o=t(0),l=t.n(o),a=t(11),s=t.n(a),d=(t(47),t(27)),u=t(17),g=t(24),b=t(22),j=t(35),p=t(70),h=t(71),f=t(5),x=t(28),O=t(33),v=t(2),y=[{id:"strategy",content:"Strategy",color:"rgba(255, 0, 0, 0.12)"},{id:"publisher",content:"Publisher",color:"rgba(0, 255, 0, 0.12)"},{id:"channel",content:"Channel",color:"rgba(255, 255, 0, 0.12)"},{id:"tactic",content:"Tactic",color:"rgba(0, 0, 255, 0.12)"}],m=[{strategy:"lower funnel",publisher:"taboola",tactic:"retargeting",channel:"display",amount:1e3},{strategy:"mid funnel",publisher:"google",tactic:"prospecting",channel:"video",amount:1e3},{strategy:"upper funnel",publisher:"trade desk",tactic:"retargeting",channel:"display",amount:1e3},{strategy:"lower funnel",publisher:"google",tactic:"retargeting",channel:"video",amount:1e3},{strategy:"mid funnel",publisher:"trade desk",tactic:"prospecting",channel:"video",amount:1e3},{strategy:"upper funnel",publisher:"google",tactic:"retargeting",channel:"display",amount:1e3},{strategy:"upper funnel",publisher:"trade desk",tactic:"prospecting",channel:"display",amount:1e3},{strategy:"lower funnel",publisher:"taboola",tactic:"retargeting",channel:"display",amount:1e3}],k=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"total",t=e.reduce((function(e,t){var r,i;"total"===n?e.total=(null!==(r=e.total)&&void 0!==r?r:0)+t.amount:e[t[n]]=(null!==(i=e[t[n]])&&void 0!==i?i:0)+t.amount;return e}),{});return t},w=function(e){k(m,"publisher");var n=Object(o.useState)([]),t=Object(g.a)(n,2),l=t[0],a=t[1],s=Object(o.useState)(!1),w=Object(g.a)(s,2),C=w[0],S=w[1],D=Object(o.useState)(!1),F=Object(g.a)(D,2),P=F[0],I=F[1];Object(o.useEffect)((function(){a(y),S(!1)}),[C]);var R=j.a.div(r||(r=Object(d.a)(["\n    display: inline-block;\n    height: 5em;\n    width: 8em;\n    box-shadow: 3px 4px 6px rgba(33, 33, 33, 0.7);\n  "]))),E=j.a.div(i||(i=Object(d.a)(["\n    text-decoration: none;\n    padding: 1em;\n    box-sizing: border-box;\n    width: 100%;\n    height: 100%;\n    color: #000;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-around;\n    align-items: center;\n    background-color: inherit;\n  "]))),T=function(e){var n=e.level,t=e.item,r=e.value;return Object(v.jsx)(R,{style:{backgroundColor:y.filter((function(e){return e.id===n}))[0].color},children:Object(v.jsxs)(E,{children:[Object(v.jsx)("div",{children:n}),Object(v.jsx)("div",{children:t}),Object(v.jsxs)("div",{children:["$",r]})]})})},J=function e(n){var t=n.level,r=n.items;return console.group("TreeLevel"),console.log(t),console.log(r),console.groupEnd(),Object(v.jsx)(v.Fragment,{children:Object.keys(r).map((function(n){var i=r[n].children&&Object.keys(r[n].children).length>0?Object.keys(r[n].children)[0]:null;return Object(v.jsx)(O.b,{label:Object(v.jsx)(T,{level:t,item:n,value:r[n].root}),children:i&&Object(v.jsx)(e,{level:i,items:r[n].children[i]})})}))})};if(!l)return null;var L=function e(n,t){if(0!==t.length){var r=JSON.parse(JSON.stringify(t)),i=r.shift();console.log("This Level: ",i);var c=k(n,i.id),o=Object.keys(c);console.log(r);var l={},a={};return o.forEach((function(t){l[t]={},l[t].root=c[t],l[t].children=e(n.filter((function(e){return e[i.id]===t})),r)})),a[i.id]=l,console.log(a),a}}(m,l);console.log(L);var N=L?Object.keys(L)[0]:"";return console.log(N),Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)(b.a,{styles:Object(b.b)(c||(c=Object(d.a)(["\n          .invisible {\n            opacity: 0.1 !important;\n          }\n          .visible {\n            opacity: 1;\n          }\n        "])))}),Object(v.jsx)(x.a,{onDragEnd:function(e){if(e.destination){var n=function(e,n,t){var r=Array.from(e),i=r.splice(n,1),c=Object(g.a)(i,1)[0];return r.splice(t,0,c),r}(l,e.source.index,e.destination.index);console.log(n),I(!1),a(n)}},onDragStart:function(){I(!0)},children:Object(v.jsx)(x.c,{droppableId:"droppable",direction:"horizontal",children:function(e,n){return Object(v.jsx)("div",{style:{display:"flex",flexDirection:"row",margin:"60px auto 60px 0",justifyContent:"space-around"},children:Object(v.jsxs)("div",Object(u.a)(Object(u.a)({ref:e.innerRef,style:(t=n.isDraggingOver,{background:t?"lightblue":"lightgrey",display:"flex",padding:8,overflow:"auto"})},e.droppableProps),{},{children:[Object(v.jsx)(p.a,{style:{marginRight:10},variant:"outlined",color:"primary",onClick:function(){return S(!0)},children:"Reset"}),l.map((function(e,n){return Object(v.jsx)(x.b,{draggableId:e.id,index:n,children:function(n,t){return Object(v.jsxs)("div",Object(u.a)(Object(u.a)(Object(u.a)({ref:n.innerRef},n.draggableProps),n.dragHandleProps),{},{style:(r=t.isDragging,i=n.draggableProps.style,Object(u.a)({userSelect:"none",padding:"".concat(8,"px ").concat(16,"px ").concat(8,"px ").concat(16,"px"),margin:"0 ".concat(8,"px 0 0"),borderRadius:999,color:"white",background:r?"darkorchid":"indigo",display:"flex",flexDirection:"row",alignItems:"center",gap:20},i)),children:[e.content,Object(v.jsx)(h.a,{onClick:function(){return function(e){var n=l.filter((function(n){return n.id!=e}));I(!1),a(n)}(e.id)}})]}));var r,i}},e.id)})),e.placeholder]}))});var t}})}),Object(v.jsx)("div",{className:Object(f.a)([P&&"invisible"]),style:{display:"flex",flexDirection:"column",alignItems:"center",transition:"opacity .25s",margin:"0 auto"},children:L&&Object(v.jsx)(O.a,{lineWidth:"2px",lineColor:"green",lineBorderRadius:"10px",label:Object(v.jsx)(R,{style:{backgroundColor:"lightgray",display:"flex",flexDirection:"column",margin:"0 auto"},children:Object(v.jsxs)(E,{children:[Object(v.jsx)("div",{children:"Fluffery"}),Object(v.jsx)("div",{children:"Name"}),Object(v.jsxs)("div",{children:["$",k(m).total]})]})}),children:Object(v.jsx)(J,{level:N,items:L[N]})})})]})},C=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,72)).then((function(n){var t=n.getCLS,r=n.getFID,i=n.getFCP,c=n.getLCP,o=n.getTTFB;t(e),r(e),i(e),c(e),o(e)}))};s.a.render(Object(v.jsx)(l.a.StrictMode,{children:Object(v.jsx)(w,{})}),document.getElementById("root")),C()}},[[52,1,2]]]);
//# sourceMappingURL=main.ae109f18.chunk.js.map