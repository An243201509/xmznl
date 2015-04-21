// BigInt.js - Arbitrary size integer math package for JavaScript
/*
 Copyright (c) 2012 Daniel Trebbien and other contributors
Portions Copyright (c) 2003 STZ-IDA and PTV AG, Karlsruhe, Germany
Portions Copyright (c) 1995-2001 International Business Machines Corporation and others

All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, provided that the above copyright notice(s) and this permission notice appear in all copies of the Software and that both the above copyright notice(s) and this permission notice appear in supporting documentation.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF THIRD PARTY RIGHTS. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

Except as contained in this notice, the name of a copyright holder shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization of the copyright holder.
*/
(function(){var m,h=function(){this.form=this.digits=0;this.lostDigits=!1;this.roundingMode=0;var a=this.DEFAULT_FORM,b=this.DEFAULT_LOSTDIGITS,c=this.DEFAULT_ROUNDINGMODE;if(4==h.arguments.length)a=h.arguments[1],b=h.arguments[2],c=h.arguments[3];else if(3==h.arguments.length)a=h.arguments[1],b=h.arguments[2];else if(2==h.arguments.length)a=h.arguments[1];else if(1!=h.arguments.length)throw"MathContext(): "+h.arguments.length+" arguments given; expected 1 to 4";var d=h.arguments[0];if(d!=this.DEFAULT_DIGITS){if(d<
this.MIN_DIGITS)throw"MathContext(): Digits too small: "+d;if(d>this.MAX_DIGITS)throw"MathContext(): Digits too large: "+d;}if(a!=this.SCIENTIFIC&&a!=this.ENGINEERING&&a!=this.PLAIN)throw"MathContext() Bad form value: "+a;if(!this.isValidRound(c))throw"MathContext(): Bad roundingMode value: "+c;this.digits=d;this.form=a;this.lostDigits=b;this.roundingMode=c};h.prototype.getDigits=function(){return this.digits};h.prototype.getForm=function(){return this.form};h.prototype.getLostDigits=function(){return this.lostDigits};
h.prototype.getRoundingMode=function(){return this.roundingMode};h.prototype.toString=function(){var a=null,b=0,c=null,a=this.form==this.SCIENTIFIC?"SCIENTIFIC":this.form==this.ENGINEERING?"ENGINEERING":"PLAIN",d=this.ROUNDS.length,b=0;a:for(;0<d;d--,b++)if(this.roundingMode==this.ROUNDS[b]){c=this.ROUNDWORDS[b];break a}return"digits="+this.digits+" form="+a+" lostDigits="+(this.lostDigits?"1":"0")+" roundingMode="+c};h.prototype.isValidRound=function(a){var b=0,c=this.ROUNDS.length,b=0;for(;0<c;c--,
b++)if(a==this.ROUNDS[b])return!0;return!1};h.prototype.PLAIN=0;h.prototype.SCIENTIFIC=1;h.prototype.ENGINEERING=2;h.prototype.ROUND_CEILING=2;h.prototype.ROUND_DOWN=1;h.prototype.ROUND_FLOOR=3;h.prototype.ROUND_HALF_DOWN=5;h.prototype.ROUND_HALF_EVEN=6;h.prototype.ROUND_HALF_UP=4;h.prototype.ROUND_UNNECESSARY=7;h.prototype.ROUND_UP=0;h.prototype.DEFAULT_FORM=h.prototype.SCIENTIFIC;h.prototype.DEFAULT_DIGITS=9;h.prototype.DEFAULT_LOSTDIGITS=!1;h.prototype.DEFAULT_ROUNDINGMODE=h.prototype.ROUND_HALF_UP;
h.prototype.MIN_DIGITS=0;h.prototype.MAX_DIGITS=999999999;h.prototype.ROUNDS=[h.prototype.ROUND_HALF_UP,h.prototype.ROUND_UNNECESSARY,h.prototype.ROUND_CEILING,h.prototype.ROUND_DOWN,h.prototype.ROUND_FLOOR,h.prototype.ROUND_HALF_DOWN,h.prototype.ROUND_HALF_EVEN,h.prototype.ROUND_UP];h.prototype.ROUNDWORDS="ROUND_HALF_UP ROUND_UNNECESSARY ROUND_CEILING ROUND_DOWN ROUND_FLOOR ROUND_HALF_DOWN ROUND_HALF_EVEN ROUND_UP".split(" ");h.prototype.DEFAULT=new h(h.prototype.DEFAULT_DIGITS,h.prototype.DEFAULT_FORM,
h.prototype.DEFAULT_LOSTDIGITS,h.prototype.DEFAULT_ROUNDINGMODE);m=h;var u,F=function(a,b){return(a-a%b)/b},J=function(a){var b=Array(a),c;for(c=0;c<a;++c)b[c]=0;return b},l=function(){this.ind=0;this.form=m.prototype.PLAIN;this.mant=null;this.exp=0;if(0!=l.arguments.length){var a,b,c;1==l.arguments.length?(a=l.arguments[0],b=0,c=a.length):(a=l.arguments[0],b=l.arguments[1],c=l.arguments[2]);"string"==typeof a&&(a=a.split(""));var d,e,i,f,g,j=0,k=0;e=!1;var h=k=k=j=0,p=0;f=0;0>=c&&this.bad("BigDecimal(): ",
a);this.ind=this.ispos;"-"==a[0]?(c--,0==c&&this.bad("BigDecimal(): ",a),this.ind=this.isneg,b++):"+"==a[0]&&(c--,0==c&&this.bad("BigDecimal(): ",a),b++);e=d=!1;i=0;g=f=-1;h=c;j=b;a:for(;0<h;h--,j++){k=a[j];if("0"<=k&&"9">=k){g=j;i++;continue a}if("."==k){0<=f&&this.bad("BigDecimal(): ",a);f=j-b;continue a}if("e"!=k&&"E"!=k){("0">k||"9"<k)&&this.bad("BigDecimal(): ",a);d=!0;g=j;i++;continue a}j-b>c-2&&this.bad("BigDecimal(): ",a);e=!1;"-"==a[j+1]?(e=!0,j+=2):j="+"==a[j+1]?j+2:j+1;k=c-(j-b);(0==k||
9<k)&&this.bad("BigDecimal(): ",a);c=k;k=j;for(;0<c;c--,k++)h=a[k],"0">h&&this.bad("BigDecimal(): ",a),"9"<h?this.bad("BigDecimal(): ",a):p=h-0,this.exp=10*this.exp+p;e&&(this.exp=-this.exp);e=!0;break a}0==i&&this.bad("BigDecimal(): ",a);0<=f&&(this.exp=this.exp+f-i);p=g-1;j=b;a:for(;j<=p;j++)if(k=a[j],"0"==k)b++,f--,i--;else if("."==k)b++,f--;else break a;this.mant=Array(i);k=b;if(d){b=i;j=0;for(;0<b;b--,j++)j==f&&k++,h=a[k],"9">=h?this.mant[j]=h-0:this.bad("BigDecimal(): ",a),k++}else{b=i;j=0;
for(;0<b;b--,j++)j==f&&k++,this.mant[j]=a[k]-0,k++}if(0==this.mant[0]){if(this.ind=this.iszero,0<this.exp&&(this.exp=0),e)this.mant=this.ZERO.mant,this.exp=0}else e&&(this.form=m.prototype.SCIENTIFIC,f=this.exp+this.mant.length-1,(f<this.MinExp||f>this.MaxExp)&&this.bad("BigDecimal(): ",a))}},G=function(){var a;if(1==G.arguments.length)a=G.arguments[0];else if(0==G.arguments.length)a=this.plainMC;else throw"abs(): "+G.arguments.length+" arguments given; expected 0 or 1";return this.ind==this.isneg?
this.negate(a):this.plus(a)},v=function(){var a;if(2==v.arguments.length)a=v.arguments[1];else if(1==v.arguments.length)a=this.plainMC;else throw"add(): "+v.arguments.length+" arguments given; expected 1 or 2";var b=v.arguments[0],c,d,e,i,f,g,j,k=0;d=k=0;var k=null,h=k=0,p=0,s=0,r=0,n=0;a.lostDigits&&this.checkdigits(b,a.digits);c=this;if(0==c.ind&&a.form!=m.prototype.PLAIN)return b.plus(a);if(0==b.ind&&a.form!=m.prototype.PLAIN)return c.plus(a);d=a.digits;0<d&&(c.mant.length>d&&(c=this.clone(c).round(a)),
b.mant.length>d&&(b=this.clone(b).round(a)));e=new l;i=c.mant;f=c.mant.length;g=b.mant;j=b.mant.length;if(c.exp==b.exp)e.exp=c.exp;else if(c.exp>b.exp){k=f+c.exp-b.exp;if(k>=j+d+1&&0<d)return e.mant=i,e.exp=c.exp,e.ind=c.ind,f<d&&(e.mant=this.extend(c.mant,d),e.exp-=d-f),e.finish(a,!1);e.exp=b.exp;k>d+1&&0<d&&(k=k-d-1,j-=k,e.exp+=k,k=d+1);k>f&&(f=k)}else{k=j+b.exp-c.exp;if(k>=f+d+1&&0<d)return e.mant=g,e.exp=b.exp,e.ind=b.ind,j<d&&(e.mant=this.extend(b.mant,d),e.exp-=d-j),e.finish(a,!1);e.exp=c.exp;
k>d+1&&0<d&&(k=k-d-1,f-=k,e.exp+=k,k=d+1);k>j&&(j=k)}e.ind=c.ind==this.iszero?this.ispos:c.ind;if((c.ind==this.isneg?1:0)==(b.ind==this.isneg?1:0))d=1;else{do{d=-1;do if(b.ind!=this.iszero)if(f<j||c.ind==this.iszero)k=i,i=g,g=k,k=f,f=j,j=k,e.ind=-e.ind;else if(!(f>j)){h=k=0;p=i.length-1;s=g.length-1;c:for(;;){if(k<=p)r=i[k];else{if(h>s){if(a.form!=m.prototype.PLAIN)return this.ZERO;break c}r=0}n=h<=s?g[h]:0;if(r!=n){r<n&&(k=i,i=g,g=k,k=f,f=j,j=k,e.ind=-e.ind);break c}k++;h++}}while(0)}while(0)}e.mant=
this.byteaddsub(i,f,g,j,d,!1);return e.finish(a,!1)},w=function(){var a;if(2==w.arguments.length)a=w.arguments[1];else if(1==w.arguments.length)a=this.plainMC;else throw"compareTo(): "+w.arguments.length+" arguments given; expected 1 or 2";var b=w.arguments[0],c=0,c=0;a.lostDigits&&this.checkdigits(b,a.digits);if(this.ind==b.ind&&this.exp==b.exp){c=this.mant.length;if(c<b.mant.length)return-this.ind;if(c>b.mant.length)return this.ind;if(c<=a.digits||0==a.digits){a=c;c=0;for(;0<a;a--,c++){if(this.mant[c]<
b.mant[c])return-this.ind;if(this.mant[c]>b.mant[c])return this.ind}return 0}}else{if(this.ind<b.ind)return-1;if(this.ind>b.ind)return 1}b=this.clone(b);b.ind=-b.ind;return this.add(b,a).ind},o=function(){var a,b=-1;if(2==o.arguments.length)a="number"==typeof o.arguments[1]?new m(0,m.prototype.PLAIN,!1,o.arguments[1]):o.arguments[1];else if(3==o.arguments.length){b=o.arguments[1];if(0>b)throw"divide(): Negative scale: "+b;a=new m(0,m.prototype.PLAIN,!1,o.arguments[2])}else if(1==o.arguments.length)a=
this.plainMC;else throw"divide(): "+o.arguments.length+" arguments given; expected between 1 and 3";return this.dodivide("D",o.arguments[0],a,b)},x=function(){var a;if(2==x.arguments.length)a=x.arguments[1];else if(1==x.arguments.length)a=this.plainMC;else throw"divideInteger(): "+x.arguments.length+" arguments given; expected 1 or 2";return this.dodivide("I",x.arguments[0],a,0)},y=function(){var a;if(2==y.arguments.length)a=y.arguments[1];else if(1==y.arguments.length)a=this.plainMC;else throw"max(): "+
y.arguments.length+" arguments given; expected 1 or 2";var b=y.arguments[0];return 0<=this.compareTo(b,a)?this.plus(a):b.plus(a)},z=function(){var a;if(2==z.arguments.length)a=z.arguments[1];else if(1==z.arguments.length)a=this.plainMC;else throw"min(): "+z.arguments.length+" arguments given; expected 1 or 2";var b=z.arguments[0];return 0>=this.compareTo(b,a)?this.plus(a):b.plus(a)},A=function(){var a;if(2==A.arguments.length)a=A.arguments[1];else if(1==A.arguments.length)a=this.plainMC;else throw"multiply(): "+
A.arguments.length+" arguments given; expected 1 or 2";var b=A.arguments[0],c,d,e,i=e=null,f,g=0,j,k=0,h=0;a.lostDigits&&this.checkdigits(b,a.digits);c=this;d=0;e=a.digits;0<e?(c.mant.length>e&&(c=this.clone(c).round(a)),b.mant.length>e&&(b=this.clone(b).round(a))):(0<c.exp&&(d+=c.exp),0<b.exp&&(d+=b.exp));c.mant.length<b.mant.length?(e=c.mant,i=b.mant):(e=b.mant,i=c.mant);f=e.length+i.length-1;g=9<e[0]*i[0]?f+1:f;j=new l;var g=this.createArrayWithZeros(g),m=e.length,k=0;for(;0<m;m--,k++)h=e[k],0!=
h&&(g=this.byteaddsub(g,g.length,i,f,h,!0)),f--;j.ind=c.ind*b.ind;j.exp=c.exp+b.exp-d;j.mant=0==d?g:this.extend(g,g.length+d);return j.finish(a,!1)},H=function(){var a;if(1==H.arguments.length)a=H.arguments[0];else if(0==H.arguments.length)a=this.plainMC;else throw"negate(): "+H.arguments.length+" arguments given; expected 0 or 1";var b;a.lostDigits&&this.checkdigits(null,a.digits);b=this.clone(this);b.ind=-b.ind;return b.finish(a,!1)},I=function(){var a;if(1==I.arguments.length)a=I.arguments[0];
else if(0==I.arguments.length)a=this.plainMC;else throw"plus(): "+I.arguments.length+" arguments given; expected 0 or 1";a.lostDigits&&this.checkdigits(null,a.digits);return a.form==m.prototype.PLAIN&&this.form==m.prototype.PLAIN&&(this.mant.length<=a.digits||0==a.digits)?this:this.clone(this).finish(a,!1)},B=function(){var a;if(2==B.arguments.length)a=B.arguments[1];else if(1==B.arguments.length)a=this.plainMC;else throw"pow(): "+B.arguments.length+" arguments given; expected 1 or 2";var b=B.arguments[0],
c,d,e,i=e=0,f,g=0;a.lostDigits&&this.checkdigits(b,a.digits);c=b.intcheck(this.MinArg,this.MaxArg);d=this;e=a.digits;if(0==e){if(b.ind==this.isneg)throw"pow(): Negative power: "+b.toString();e=0}else{if(b.mant.length+b.exp>e)throw"pow(): Too many digits: "+b.toString();d.mant.length>e&&(d=this.clone(d).round(a));i=b.mant.length+b.exp;e=e+i+1}e=new m(e,a.form,!1,a.roundingMode);i=this.ONE;if(0==c)return i;0>c&&(c=-c);f=!1;g=1;a:for(;;g++){c<<=1;0>c&&(f=!0,i=i.multiply(d,e));if(31==g)break a;if(!f)continue a;
i=i.multiply(i,e)}0>b.ind&&(i=this.ONE.divide(i,e));return i.finish(a,!0)},C=function(){var a;if(2==C.arguments.length)a=C.arguments[1];else if(1==C.arguments.length)a=this.plainMC;else throw"remainder(): "+C.arguments.length+" arguments given; expected 1 or 2";return this.dodivide("R",C.arguments[0],a,-1)},D=function(){var a;if(2==D.arguments.length)a=D.arguments[1];else if(1==D.arguments.length)a=this.plainMC;else throw"subtract(): "+D.arguments.length+" arguments given; expected 1 or 2";var b=
D.arguments[0];a.lostDigits&&this.checkdigits(b,a.digits);b=this.clone(b);b.ind=-b.ind;return this.add(b,a)},q=function(){var a,b,c,d;if(6==q.arguments.length)a=q.arguments[2],b=q.arguments[3],c=q.arguments[4],d=q.arguments[5];else if(2==q.arguments.length)b=a=-1,c=m.prototype.SCIENTIFIC,d=this.ROUND_HALF_UP;else throw"format(): "+q.arguments.length+" arguments given; expected 2 or 6";var e=q.arguments[0],i=q.arguments[1],f,g=0,g=g=0,j=null,k=j=g=0;f=0;g=null;k=j=0;(-1>e||0==e)&&this.badarg("format",
1,e);-1>i&&this.badarg("format",2,i);(-1>a||0==a)&&this.badarg("format",3,a);-1>b&&this.badarg("format",4,b);c!=m.prototype.SCIENTIFIC&&c!=m.prototype.ENGINEERING&&(-1==c?c=m.prototype.SCIENTIFIC:this.badarg("format",5,c));if(d!=this.ROUND_HALF_UP)try{-1==d?d=this.ROUND_HALF_UP:new m(9,m.prototype.SCIENTIFIC,!1,d)}catch(l){this.badarg("format",6,d)}f=this.clone(this);-1==b?f.form=m.prototype.PLAIN:f.ind==this.iszero?f.form=m.prototype.PLAIN:(g=f.exp+f.mant.length,f.form=g>b?c:-5>g?c:m.prototype.PLAIN);
if(0<=i)a:for(;;){f.form==m.prototype.PLAIN?g=-f.exp:f.form==m.prototype.SCIENTIFIC?g=f.mant.length-1:(g=(f.exp+f.mant.length-1)%3,0>g&&(g=3+g),g++,g=g>=f.mant.length?0:f.mant.length-g);if(g==i)break a;if(g<i){j=this.extend(f.mant,f.mant.length+i-g);f.mant=j;f.exp-=i-g;if(f.exp<this.MinExp)throw"format(): Exponent Overflow: "+f.exp;break a}g-=i;if(g>f.mant.length){f.mant=this.ZERO.mant;f.ind=this.iszero;f.exp=0;continue a}j=f.mant.length-g;k=f.exp;f.round(j,d);if(f.exp-k==g)break a}b=f.layout();if(0<
e){c=b.length;f=0;a:for(;0<c;c--,f++){if("."==b[f])break a;if("E"==b[f])break a}f>e&&this.badarg("format",1,e);if(f<e){g=Array(b.length+e-f);e-=f;j=0;for(;0<e;e--,j++)g[j]=" ";this.arraycopy(b,0,g,j,b.length);b=g}}if(0<a){e=b.length-1;f=b.length-1;a:for(;0<e;e--,f--)if("E"==b[f])break a;if(0==f){g=Array(b.length+a+2);this.arraycopy(b,0,g,0,b.length);a+=2;j=b.length;for(;0<a;a--,j++)g[j]=" ";b=g}else if(k=b.length-f-2,k>a&&this.badarg("format",3,a),k<a){g=Array(b.length+a-k);this.arraycopy(b,0,g,0,
f+2);a-=k;j=f+2;for(;0<a;a--,j++)g[j]="0";this.arraycopy(b,f+2,g,j,k);b=g}}return b.join("")},E=function(){var a;if(2==E.arguments.length)a=E.arguments[1];else if(1==E.arguments.length)a=this.ROUND_UNNECESSARY;else throw"setScale(): "+E.arguments.length+" given; expected 1 or 2";var b=E.arguments[0],c,d;c=c=0;c=this.scale();if(c==b&&this.form==m.prototype.PLAIN)return this;d=this.clone(this);if(c<=b)c=0==c?d.exp+b:b-c,d.mant=this.extend(d.mant,d.mant.length+c),d.exp=-b;else{if(0>b)throw"setScale(): Negative scale: "+
b;c=d.mant.length-(c-b);d=d.round(c,a);d.exp!=-b&&(d.mant=this.extend(d.mant,d.mant.length+1),d.exp-=1)}d.form=m.prototype.PLAIN;return d};u=function(){var a,b=0,c=0;a=Array(190);b=0;a:for(;189>=b;b++){c=b-90;if(0<=c){a[b]=c%10;l.prototype.bytecar[b]=F(c,10);continue a}c+=100;a[b]=c%10;l.prototype.bytecar[b]=F(c,10)-10}return a};var t=function(){var a,b;if(2==t.arguments.length)a=t.arguments[0],b=t.arguments[1];else if(1==t.arguments.length)b=t.arguments[0],a=b.digits,b=b.roundingMode;else throw"round(): "+
t.arguments.length+" arguments given; expected 1 or 2";var c,d,e=!1,i=0,f;c=null;c=this.mant.length-a;if(0>=c)return this;this.exp+=c;c=this.ind;d=this.mant;0<a?(this.mant=Array(a),this.arraycopy(d,0,this.mant,0,a),e=!0,i=d[a]):(this.mant=this.ZERO.mant,this.ind=this.iszero,e=!1,i=0==a?d[0]:0);f=0;if(b==this.ROUND_HALF_UP)5<=i&&(f=c);else if(b==this.ROUND_UNNECESSARY){if(!this.allzero(d,a))throw"round(): Rounding necessary";}else if(b==this.ROUND_HALF_DOWN)5<i?f=c:5==i&&(this.allzero(d,a+1)||(f=c));
else if(b==this.ROUND_HALF_EVEN)5<i?f=c:5==i&&(this.allzero(d,a+1)?1==this.mant[this.mant.length-1]%2&&(f=c):f=c);else if(b!=this.ROUND_DOWN)if(b==this.ROUND_UP)this.allzero(d,a)||(f=c);else if(b==this.ROUND_CEILING)0<c&&(this.allzero(d,a)||(f=c));else if(b==this.ROUND_FLOOR)0>c&&(this.allzero(d,a)||(f=c));else throw"round(): Bad round value: "+b;0!=f&&(this.ind==this.iszero?(this.mant=this.ONE.mant,this.ind=f):(this.ind==this.isneg&&(f=-f),c=this.byteaddsub(this.mant,this.mant.length,this.ONE.mant,
1,f,e),c.length>this.mant.length?(this.exp++,this.arraycopy(c,0,this.mant,0,this.mant.length)):this.mant=c));if(this.exp>this.MaxExp)throw"round(): Exponent Overflow: "+this.exp;return this};l.prototype.div=F;l.prototype.arraycopy=function(a,b,c,d,e){var i;if(d>b)for(i=e-1;0<=i;--i)c[i+d]=a[i+b];else for(i=0;i<e;++i)c[i+d]=a[i+b]};l.prototype.createArrayWithZeros=J;l.prototype.abs=G;l.prototype.add=v;l.prototype.compareTo=w;l.prototype.divide=o;l.prototype.divideInteger=x;l.prototype.max=y;l.prototype.min=
z;l.prototype.multiply=A;l.prototype.negate=H;l.prototype.plus=I;l.prototype.pow=B;l.prototype.remainder=C;l.prototype.subtract=D;l.prototype.equals=function(a){var b=0,c=null,d=null;if(null==a||!(a instanceof l)||this.ind!=a.ind)return!1;if(this.mant.length==a.mant.length&&this.exp==a.exp&&this.form==a.form){c=this.mant.length;b=0;for(;0<c;c--,b++)if(this.mant[b]!=a.mant[b])return!1}else{c=this.layout();d=a.layout();if(c.length!=d.length)return!1;a=c.length;b=0;for(;0<a;a--,b++)if(c[b]!=d[b])return!1}return!0};
l.prototype.format=q;l.prototype.intValueExact=function(){var a,b=0,c,d=0;a=0;if(this.ind==this.iszero)return 0;a=this.mant.length-1;if(0>this.exp){a+=this.exp;if(!this.allzero(this.mant,a+1))throw"intValueExact(): Decimal part non-zero: "+this.toString();if(0>a)return 0;b=0}else{if(9<this.exp+a)throw"intValueExact(): Conversion overflow: "+this.toString();b=this.exp}c=0;var e=a+b,d=0;for(;d<=e;d++)c*=10,d<=a&&(c+=this.mant[d]);if(9==a+b&&(a=F(c,1E9),a!=this.mant[0])){if(-2147483648==c&&this.ind==
this.isneg&&2==this.mant[0])return c;throw"intValueExact(): Conversion overflow: "+this.toString();}return this.ind==this.ispos?c:-c};l.prototype.movePointLeft=function(a){var b;b=this.clone(this);b.exp-=a;return b.finish(this.plainMC,!1)};l.prototype.movePointRight=function(a){var b;b=this.clone(this);b.exp+=a;return b.finish(this.plainMC,!1)};l.prototype.scale=function(){return 0<=this.exp?0:-this.exp};l.prototype.setScale=E;l.prototype.signum=function(){return this.ind};l.prototype.toString=function(){return this.layout().join("")};
l.prototype.layout=function(){var a,b=0,b=null,c=0,d=0;a=0;var d=null,e,b=0;a=Array(this.mant.length);c=this.mant.length;b=0;for(;0<c;c--,b++)a[b]=this.mant[b]+"";if(this.form!=m.prototype.PLAIN){b="";this.ind==this.isneg&&(b+="-");c=this.exp+a.length-1;if(this.form==m.prototype.SCIENTIFIC)b+=a[0],1<a.length&&(b+="."),b+=a.slice(1).join("");else if(d=c%3,0>d&&(d=3+d),c-=d,d++,d>=a.length){b+=a.join("");for(a=d-a.length;0<a;a--)b+="0"}else b+=a.slice(0,d).join(""),b=b+"."+a.slice(d).join("");0!=c&&
(0>c?(a="-",c=-c):a="+",b=b+"E"+a+c);return b.split("")}if(0==this.exp){if(0<=this.ind)return a;d=Array(a.length+1);d[0]="-";this.arraycopy(a,0,d,1,a.length);return d}c=this.ind==this.isneg?1:0;e=this.exp+a.length;if(1>e){b=c+2-this.exp;d=Array(b);0!=c&&(d[0]="-");d[c]="0";d[c+1]=".";var i=-e,b=c+2;for(;0<i;i--,b++)d[b]="0";this.arraycopy(a,0,d,c+2-e,a.length);return d}if(e>a.length){d=Array(c+e);0!=c&&(d[0]="-");this.arraycopy(a,0,d,c,a.length);e-=a.length;b=c+a.length;for(;0<e;e--,b++)d[b]="0";
return d}b=c+1+a.length;d=Array(b);0!=c&&(d[0]="-");this.arraycopy(a,0,d,c,e);d[c+e]=".";this.arraycopy(a,e,d,c+e+1,a.length-e);return d};l.prototype.intcheck=function(a,b){var c;c=this.intValueExact();if(c<a||c>b)throw"intcheck(): Conversion overflow: "+c;return c};l.prototype.dodivide=function(a,b,c,d){var e,i,f,g,j,k,h,p,s,r=0,n=0,o=0;i=i=n=n=n=0;e=null;e=e=0;e=null;c.lostDigits&&this.checkdigits(b,c.digits);e=this;if(0==b.ind)throw"dodivide(): Divide by 0";if(0==e.ind)return c.form!=m.prototype.PLAIN?
this.ZERO:-1==d?e:e.setScale(d);i=c.digits;if(0<i)e.mant.length>i&&(e=this.clone(e).round(c)),b.mant.length>i&&(b=this.clone(b).round(c));else if(-1==d&&(d=e.scale()),i=e.mant.length,d!=-e.exp&&(i=i+d+e.exp),i=i-(b.mant.length-1)-b.exp,i<e.mant.length&&(i=e.mant.length),i<b.mant.length)i=b.mant.length;f=e.exp-b.exp+e.mant.length-b.mant.length;if(0>f&&"D"!=a)return"I"==a?this.ZERO:this.clone(e).finish(c,!1);g=new l;g.ind=e.ind*b.ind;g.exp=f;g.mant=this.createArrayWithZeros(i+1);j=i+i+1;f=this.extend(e.mant,
j);k=j;h=b.mant;p=j;s=10*h[0]+1;1<h.length&&(s+=h[1]);j=0;a:for(;;){r=0;b:for(;;){if(k<p)break b;if(k==p){c:do{var q=k,n=0;for(;0<q;q--,n++){o=n<h.length?h[n]:0;if(f[n]<o)break b;if(f[n]>o)break c}r++;g.mant[j]=r;j++;f[0]=0;break a}while(0);n=f[0]}else n=10*f[0],1<k&&(n+=f[1]);n=F(10*n,s);0==n&&(n=1);r+=n;f=this.byteaddsub(f,k,h,p,-n,!0);if(0!=f[0])continue b;o=k-2;n=0;c:for(;n<=o;n++){if(0!=f[n])break c;k--}if(0==n)continue b;this.arraycopy(f,n,f,0,k)}if(0!=j||0!=r){g.mant[j]=r;j++;if(j==i+1)break a;
if(0==f[0])break a}if(0<=d&&-g.exp>d)break a;if("D"!=a&&0>=g.exp)break a;g.exp-=1;p--}0==j&&(j=1);if("I"==a||"R"==a){if(j+g.exp>i)throw"dodivide(): Integer overflow";if("R"==a){do{if(0==g.mant[0])return this.clone(e).finish(c,!1);if(0==f[0])return this.ZERO;g.ind=e.ind;i=i+i+1-e.mant.length;g.exp=g.exp-i+e.exp;i=k;n=i-1;b:for(;1<=n&&g.exp<e.exp&&g.exp<b.exp;n--){if(0!=f[n])break b;i--;g.exp+=1}i<f.length&&(e=Array(i),this.arraycopy(f,0,e,0,i),f=e);g.mant=f;return g.finish(c,!1)}while(0)}}else 0!=
f[0]&&(e=g.mant[j-1],0==e%5&&(g.mant[j-1]=e+1));if(0<=d)return j!=g.mant.length&&(g.exp-=g.mant.length-j),e=g.mant.length-(-g.exp-d),g.round(e,c.roundingMode),g.exp!=-d&&(g.mant=this.extend(g.mant,g.mant.length+1),g.exp-=1),g.finish(c,!0);if(j==g.mant.length)g.round(c);else{if(0==g.mant[0])return this.ZERO;e=Array(j);this.arraycopy(g.mant,0,e,0,j);g.mant=e}return g.finish(c,!0)};l.prototype.bad=function(a,b){throw a+"Not a number: "+b;};l.prototype.badarg=function(a,b,c){throw"Bad argument "+b+" to "+
a+": "+c;};l.prototype.extend=function(a,b){var c;if(a.length==b)return a;c=J(b);this.arraycopy(a,0,c,0,a.length);return c};l.prototype.byteaddsub=function(a,b,c,d,e,i){var f,g,j,k,l,h,m=0;f=h=0;f=a.length;g=c.length;b-=1;k=j=d-1;k<b&&(k=b);d=null;i&&k+1==f&&(d=a);null==d&&(d=this.createArrayWithZeros(k+1));l=!1;1==e?l=!0:-1==e&&(l=!0);h=0;m=k;a:for(;0<=m;m--){0<=b&&(b<f&&(h+=a[b]),b--);0<=j&&(j<g&&(h=l?0<e?h+c[j]:h-c[j]:h+c[j]*e),j--);if(10>h&&0<=h){do{d[m]=h;h=0;continue a}while(0)}h+=90;d[m]=this.bytedig[h];
h=this.bytecar[h]}if(0==h)return d;c=null;i&&k+2==a.length&&(c=a);null==c&&(c=Array(k+2));c[0]=h;a=k+1;f=0;for(;0<a;a--,f++)c[f+1]=d[f];return c};l.prototype.diginit=u;l.prototype.clone=function(a){var b;b=new l;b.ind=a.ind;b.exp=a.exp;b.form=a.form;b.mant=a.mant;return b};l.prototype.checkdigits=function(a,b){if(0!=b){if(this.mant.length>b&&!this.allzero(this.mant,b))throw"Too many digits: "+this.toString();if(null!=a&&a.mant.length>b&&!this.allzero(a.mant,b))throw"Too many digits: "+a.toString();
}};l.prototype.round=t;l.prototype.allzero=function(a,b){var c=0;0>b&&(b=0);var d=a.length-1,c=b;for(;c<=d;c++)if(0!=a[c])return!1;return!0};l.prototype.finish=function(a,b){var c=0,d=0,e=null,c=d=0;0!=a.digits&&this.mant.length>a.digits&&this.round(a);if(b&&a.form!=m.prototype.PLAIN){c=this.mant.length;d=c-1;a:for(;1<=d;d--){if(0!=this.mant[d])break a;c--;this.exp++}c<this.mant.length&&(e=Array(c),this.arraycopy(this.mant,0,e,0,c),this.mant=e)}this.form=m.prototype.PLAIN;c=this.mant.length;d=0;for(;0<
c;c--,d++)if(0!=this.mant[d]){0<d&&(e=Array(this.mant.length-d),this.arraycopy(this.mant,d,e,0,this.mant.length-d),this.mant=e);d=this.exp+this.mant.length;if(0<d){if(d>a.digits&&0!=a.digits&&(this.form=a.form),d-1<=this.MaxExp)return this}else-5>d&&(this.form=a.form);d--;if(d<this.MinExp||d>this.MaxExp){b:do{if(this.form==m.prototype.ENGINEERING&&(c=d%3,0>c&&(c=3+c),d-=c,d>=this.MinExp&&d<=this.MaxExp))break b;throw"finish(): Exponent Overflow: "+d;}while(0)}return this}this.ind=this.iszero;if(a.form!=
m.prototype.PLAIN)this.exp=0;else if(0<this.exp)this.exp=0;else if(this.exp<this.MinExp)throw"finish(): Exponent Overflow: "+this.exp;this.mant=this.ZERO.mant;return this};l.prototype.isGreaterThan=function(a){return 0<this.compareTo(a)};l.prototype.isLessThan=function(a){return 0>this.compareTo(a)};l.prototype.isGreaterThanOrEqualTo=function(a){return 0<=this.compareTo(a)};l.prototype.isLessThanOrEqualTo=function(a){return 0>=this.compareTo(a)};l.prototype.isPositive=function(){return 0<this.compareTo(l.prototype.ZERO)};
l.prototype.isNegative=function(){return 0>this.compareTo(l.prototype.ZERO)};l.prototype.isZero=function(){return this.equals(l.prototype.ZERO)};l.prototype.ROUND_CEILING=m.prototype.ROUND_CEILING;l.prototype.ROUND_DOWN=m.prototype.ROUND_DOWN;l.prototype.ROUND_FLOOR=m.prototype.ROUND_FLOOR;l.prototype.ROUND_HALF_DOWN=m.prototype.ROUND_HALF_DOWN;l.prototype.ROUND_HALF_EVEN=m.prototype.ROUND_HALF_EVEN;l.prototype.ROUND_HALF_UP=m.prototype.ROUND_HALF_UP;l.prototype.ROUND_UNNECESSARY=m.prototype.ROUND_UNNECESSARY;
l.prototype.ROUND_UP=m.prototype.ROUND_UP;l.prototype.ispos=1;l.prototype.iszero=0;l.prototype.isneg=-1;l.prototype.MinExp=-999999999;l.prototype.MaxExp=999999999;l.prototype.MinArg=-999999999;l.prototype.MaxArg=999999999;l.prototype.plainMC=new m(0,m.prototype.PLAIN);l.prototype.bytecar=Array(190);l.prototype.bytedig=u();l.prototype.ZERO=new l("0");l.prototype.ONE=new l("1");l.prototype.TEN=new l("10");u=l;"function"===typeof define&&null!=define.amd?define({BigDecimal:u,MathContext:m}):"object"===
typeof this&&(this.BigDecimal=u,this.MathContext=m)}).call(this);

function _BigInt_toStringBase(base)
{
    var i, j, hbase;
    var t;
    var ds;
    var c;

    i = this.len;
    if(i == 0)
      return "0";
    if(i == 1 && !this.digits[0])
      return "0";

    switch(base) {
      default:
      case 10:
      j = Math.floor((2*8*i*241)/800)+2;
      hbase = 10000;
      break;

      case 16:
      j = Math.floor((2*8*i)/4)+2;
      hbase = 0x10000;
      break;

      case 8:
      j = (2*8*i)+2;
      hbase = 010000;
      break;

      case 2:
      j = (2*8*i)+2;
      hbase = 020;
      break;
    }

    t = this.clone();
    ds = t.digits;
    s = "";

    while (i && j) {
      var k = i;
      var num = 0;

      while (k--) {
	num = (num<<16) + ds[k];
	if(num < 0) num += 4294967296;
	ds[k] = Math.floor(num / hbase);
	num %= hbase;
      }

      if (ds[i-1] == 0)
        i--;
      k = 4;
      while (k--) {
	c = (num % base);
	s = "0123456789abcdef".charAt(c) + s;
	--j;
	num = Math.floor(num / base);
	if (i == 0 && num == 0) {
	  break;
	}
      }
    }

    i = 0;
    while(i < s.length && s.charAt(i) == "0")
      i++;
    if(i)
      s = s.substring(i, s.length);
    if(!this.sign)
      s = "-" + s;
    return s;
}
function _BigInt_clone()
{
  var x, i;

  x = new BigInt(this.len, this.sign);
  for(i = 0; i < this.len; i++)
    x.digits[i] = this.digits[i];
  return x;
}

function BigInt(len, sign)
{
  var i, x, need_init;

  // Setup member functions.
  // Note: There is G.C. bug of function() in Netscape!
  //       Don't use anonymous function.
  this.toString = _BigInt_toString;
  this.toStringBase = _BigInt_toStringBase;
  this.clone = _BigInt_clone;

  if(BigInt.arguments.length == 0) {
    this.sign = true;
    this.len = len = 1;
    this.digits = new Array(1);
    need_init = true;
  } else if(BigInt.arguments.length == 1) {
    x = bigint_from_any(BigInt.arguments[0]);
    if(x == BigInt.arguments[0])
      x = x.clone();
    this.sign = x.sign;
    this.len = x.len;
    this.digits = x.digits;
    need_init = false;
  } else {
    this.sign = (sign ? true : false);
    this.len = len;
    this.digits = new Array(len);
    need_init = true;
  }

  if(need_init) {
    for(i = 0; i < len; i++)
      this.digits[i] = 0;
  }
}

function bigint_norm(x)
{
  var len = x.len;
  var ds = x.digits;

  while(len-- && !ds[len])
    ;
  x.len = ++len;
  return x;
}

function bigint_from_int(n)
{
  var sign, big, i;

  if(n < 0) {
    n = -n;
    sign = false;
  } else
    sign = true;
  n &= 0x7fffffff;

  if(n <= 0xffff) {
    big = new BigInt(1, 1);
    big.digits[0] = n;
  } else {
    big = new BigInt(2, 1);
    big.digits[0] = (n & 0xffff);
    big.digits[1] = ((n>>16) & 0xffff);
  }
  return big;
}

function bigint_from_string(str, base)
{
  var str_i;
  var sign = true;
  var c;
  var len;
  var z;
  var zds;
  var num;
  var i;
  var blen = 1;

  str += "@";	// Terminator;

  str_i = 0;
  // TODO: skip white spaces

  if(str.charAt(str_i) == "+") {
    str_i++;
  }
  else if (str.charAt(str_i) == "-") {
    str_i++;
    sign = false;
  }

  if (str.charAt(str_i) == "@")
    return null;

  if (!base) {
    if (str.charAt(str_i) == "0") {
      c = str.charAt(str_i + 1);
      if (c == "x" || c == "X") {
	base = 16;
      }
      else if (c == "b" || c == "B") {
	base = 2;
      }
      else {
	base = 8;
      }
    }
    else {
      base = 10;
    }
  }

  if (base == 8) {
    while (str.charAt(str_i) == "0")
      str_i++;
    len = 3 * (str.length - str_i);
  }
  else {			// base == 10, 2 or 16
    if (base == 16 && str.charAt(str_i) == '0' && (str.charAt(str_i+1) == "x" || str.charAt(str_i+1) == "X")) {
      str_i += 2;
    }
    if (base == 2 && str.charAt(str_i) == '0' && (str.charAt(str_i+1) == "b"||str.charAt(str_i+1) == "B")) {
      str_i += 2;
    }
    while (str.charAt(str_i) == "0")
      str_i++;
    if (str.charAt(str_i) == "@") str_i--;
    len = 4 * (str.length - str_i);
  }

  len = (len>>4)+1;
  z = new BigInt(len, sign);
  zds = z.digits;

  while(true) {
    c = str.charAt(str_i++);
    if(c == "@")
      break;
    switch (c) {
    case '0': c = 0; break;
    case '1': c = 1; break;
    case '2': c = 2; break;
    case '3': c = 3; break;
    case '4': c = 4; break;
    case '5': c = 5; break;
    case '6': c = 6; break;
    case '7': c = 7; break;
    case '8': c = 8; break;
    case '9': c = 9; break;
    case 'a': case 'A': c = 10; break;
    case 'b': case 'B': c = 11; break;
    case 'c': case 'C': c = 12; break;
    case 'd': case 'D': c = 13; break;
    case 'e': case 'E': c = 14; break;
    case 'f': case 'F': c = 15; break;
    default:
      c = base;
      break;
    }
    if (c >= base)
      break;

    i = 0;
    num = c;
    while(true) {
      while (i<blen) {
	num += zds[i]*base;
	zds[i++] = (num & 0xffff);
	num >>>= 16;
      }
      if (num) {
	blen++;
	continue;
      }
      break;
    }
  }
  return bigint_norm(z);
}

function bigint_from_any(x)
{
  if(typeof(x) == "object") {
    if(x.constructor == BigInt)
      return x;
    return BigInt(1, 1);
  }

  if(typeof(x) == "string") {
    return bigint_from_string(x);
  }

  if(typeof(x) == "number") {
    var i, x1, x2, fpt, np;

    if(-2147483647 <= x && x <= 2147483647) {
      return bigint_from_int(x);
    }
    x = x + "";
    i = x.indexOf("e", 0);
    if(i == -1)
      return bigint_from_string(x);
    x1 = x.substr(0, i);
    x2 = x.substr(i+2, x.length - (i+2));

    fpt = x1.indexOf(".", 0);
    if(fpt != -1) {
      np = x1.length - (fpt+1);
      x1 = x1.substr(0, fpt) + x1.substr(fpt+1, np);
      x2 = parseInt(x2) - np;
    } else {
      x2 = parseInt(x2);
    }
    while(x2-- > 0) {
      x1 += "0";
    }
    return bigint_from_string(x1);
  }
  return BigInt(1, 1);
}

function bigint_uminus(x)
{
  var z = x.clone();
  z.sign = !z.sign;
  return bigint_norm(z);
}

function bigint_add_internal(x, y, sign)
{
  var z;
  var num;
  var i, len;

  sign = (sign == y.sign);
  if (x.sign != sign) {
    if (sign)
      return bigint_sub_internal(y, x);
    return bigint_sub_internal(x, y);
  }

  if (x.len > y.len) {
    len = x.len + 1;
    z = x; x = y; y = z;
  } else {
    len = y.len + 1;
  }
  z = new BigInt(len, sign);

  len = x.len;
  for (i = 0, num = 0; i < len; i++) {
    num += x.digits[i] + y.digits[i];
    z.digits[i] = (num & 0xffff);
    num >>>= 16;
  }
  len = y.len;
  while (num && i < len) {
    num += y.digits[i];
    z.digits[i++] = (num & 0xffff);
    num >>>= 16;
  }
  while (i < len) {
    z.digits[i] = y.digits[i];
    i++;
  }
  z.digits[i] = (num & 0xffff);
  return bigint_norm(z);
  //  return z;
}

function bigint_sub_internal(x, y)
{
  var z = 0;
  var zds;
  var num;
  var i;

  i = x.len;
  // if x is larger than y, swap
  if (x.len < y.len) {
    z = x; x = y; y = z;	// swap x y
  }
  else if (x.len == y.len) {
    while (i > 0) {
      i--;
      if (x.digits[i] > y.digits[i]) {
	break;
      }
      if (x.digits[i] < y.digits[i]) {
	z = x; x = y; y = z;	// swap x y
	break;
      }
    }
  }

  z = new BigInt(x.len, (z == 0) ? 1 : 0);
  zds = z.digits;

  for (i = 0, num = 0; i < y.len; i++) { 
    num += x.digits[i] - y.digits[i];
    zds[i] = (num & 0xffff);
    num >>>= 16;
  } 
  while (num && i < x.len) {
    num += x.digits[i];
    zds[i++] = (num & 0xffff);
    num >>>= 16;
  }
  while (i < x.len) {
    zds[i] = x.digits[i];
    i++;
  }
    
  return bigint_norm(z);
}

function bigint_plus(x, y)
{
  x = bigint_from_any(x);
  y = bigint_from_any(y);
  return bigint_add_internal(x, y, 1);
}

function bigint_minus(x, y)
{
  x = bigint_from_any(x);
  y = bigint_from_any(y);
  return bigint_add_internal(x, y, 0);
}

function bigint_mul(x, y)
{
  var i, j;
  var n = 0;
  var z;
  var zds, xds, yds;
  var dd, ee;
  var ylen;

  x = bigint_from_any(x);
  y = bigint_from_any(y);

  j = x.len + y.len + 1;
  z = new BigInt(j, x.sign == y.sign);

  xds = x.digits;
  yds = y.digits;
  zds = z.digits;
  ylen = y.len;
  while (j--)
    zds[j] = 0;
  for (i = 0; i < x.len; i++) {
    dd = xds[i]; 
    if (dd == 0)
      continue;
    n = 0;
    for (j = 0; j < ylen; j++) {
      ee = n + dd * yds[j];
      n = zds[i + j] + ee;
      if (ee)
	zds[i + j] = (n & 0xffff);
      n >>>= 16;
    }
    if (n) {
      zds[i + j] = n;
    }
  }

  return bigint_norm(z);
}

function bigint_divmod(x, y, modulo)
{
  var nx = x.len;
  var ny = y.len;
  var i, j;
  var yy, z;
  var xds, yds, zds, tds;
  var t2;
  var num;
  var dd, q;
  var ee;
  var mod, div;

  yds = y.digits;
  if (ny == 0 && yds[0] == 0)
    return null;	// Division by zero

  if (nx < ny || nx == ny && x.digits[nx - 1] < y.digits[ny - 1]) {
    if (modulo)
      return bigint_norm(x);
    return BigInt(1, 1);
  }

  xds = x.digits;
  if (ny == 1) {
    dd = yds[0];
    z = x.clone();
    zds = z.digits;
    t2 = 0;
    i = nx;
    while (i--) {
      t2 = t2 * 65536 + zds[i];
      zds[i] = (t2 / dd) & 0xffff;
      t2 %= dd;
    }
    z.sign = (x.sign == y.sign);
    if (modulo) {
      if (!x.sign)
	t2 = -t2;
      if (x.sign != y.sign) {
	t2 = t2 + yds[0] * (y.sign ? 1 : -1);
      }
      return bigint_from_int(t2);
    }
    return bigint_norm(z);
  }

  z = new BigInt(nx == ny ? nx + 2 : nx + 1,
		 x.sign == y.sign);
  zds = z.digits;
  if (nx == ny)
    zds[nx + 1] = 0;
  while (!yds[ny - 1])
    ny--;
  if ((dd = ((65536/(yds[ny-1]+1)) & 0xffff)) != 1) {
    yy = y.clone();
    tds = yy.digits;
    j = 0;
    num = 0;
    while (j<ny) {
      num += yds[j]*dd;
      tds[j++] = num & 0xffff;
      num >>= 16;
    }
    yds = tds;
    j = 0;
    num = 0;
    while (j<nx) {
      num += xds[j] * dd;
      zds[j++] = num & 0xffff;
      num >>= 16;
    }
    zds[j] = num & 0xffff;
  }
  else {
    zds[nx] = 0;
    j = nx;
    while (j--) zds[j] = xds[j];
  }
  j = nx==ny?nx+1:nx;
  do {
    if (zds[j] ==  yds[ny-1]) q = 65535;
    else q = ((zds[j]*65536 + zds[j-1])/yds[ny-1]) & 0xffff;
    if (q) {
      i = 0; num = 0; t2 = 0;
      do {			// multiply and subtract
	t2 += yds[i] * q;
	ee = num - (t2 & 0xffff);
	num = zds[j - ny + i] + ee;
	if (ee) zds[j - ny + i] = num & 0xffff;
	num >>= 16;
	t2 >>>= 16;
      } while (++i < ny);
      num += zds[j - ny + i] - t2; // borrow from high digit; don't update
      while (num) {		// "add back" required
	i = 0; num = 0; q--;
	do {
	  ee = num + yds[i];
	  num = zds[j - ny + i] + ee;
	  if (ee) zds[j - ny + i] = num & 0xffff;
	  num >>= 16;
	} while (++i < ny);
	num--;
      }
    }
    zds[j] = q;
  } while (--j >= ny);

  if (modulo) {			// just normalize remainder
    mod = z.clone();
    if (dd) {
      zds = mod.digits;
      t2 = 0; i = ny;
      while (i--) {
	t2 = (t2*65536) + zds[i];
	zds[i] = (t2 / dd) & 0xffff;
	t2 %= dd;
      }
    }
    mod.len = ny;
    mod.sign = x.sign;
    if (x.sign != y.sign) {
      return bigint_add_internal(mod, y, 1);
    }
    return bigint_norm(mod);
  }

  div = z.clone();
  zds = div.digits;
  j = (nx==ny ? nx+2 : nx+1) - ny;
  for (i = 0;i < j;i++) zds[i] = zds[i+ny];
  div.len = i;
  return bigint_norm(div);
}

function bigint_div(x, y)
{
  x = bigint_from_any(x);
  y = bigint_from_any(y);
  return bigint_divmod(x, y, 0);
}

function bigint_mod(x, y)
{
  x = bigint_from_any(x);
  y = bigint_from_any(y);
  return bigint_divmod(x, y, 1);
}

function bigint_cmp(x, y)
{
  var xlen;

  if(x == y)
    return 0;	// Same object

  x = bigint_from_any(x);
  y = bigint_from_any(y);
  xlen = x.len;

  if(x.sign != y.sign) {
    if(x.sign)
      return 1;
    return -1;
  }

  if (xlen < y.len)
    return (x.sign) ? -1 : 1;
  if (xlen > y.len)
    return (x.sign) ? 1 : -1;

  while(xlen-- && (x.digits[xlen] == y.digits[xlen]))
    ;
  if (-1 == xlen)
    return 0;
  return (x.digits[xlen] > y.digits[xlen]) ?
    (x.sign ? 1 : -1) :
    (x.sign ? -1 : 1);
}

function bigint_number(x)
{
  var d = 0.0;
  var i = x.len;
  var ds = x.digits;

  while (i--) {
    d = ds[i] + 65536.0 * d;
  }
  if (!x.sign) d = -d;
  return d;
}