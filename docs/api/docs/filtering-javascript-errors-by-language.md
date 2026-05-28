<!-- source: https://docs.rollbar.com/docs/filtering-javascript-errors-by-language.md -->

# Filtering Javascript errors by language

<p>If your application has an international user base, you may be receiving Javascript error reports in the local language of your users' browsers.</p>
<img src="https://rollbar.wpengine.com/wp-content/uploads/2021/05/filter-javascript.png" alt="Filtering javascript">
<p>While Rollbar can't translate error messages into your preferred language, it is possible to group errors by language so that you have fewer items to manage.</p>
<p>Here are a few custom grouping recipes to match errors based on browser language:</p>
<p><strong>One supported language</strong></p>
<p>The following rule groups errors where client.language.javascript does not contain en-:
{
&quot;condition&quot;: {
&quot;path&quot;: &quot;client.javascript.language&quot;,&quot;ncontains&quot;: &quot;en-&quot;
},
&quot;fingerprint&quot;: &quot;non-en error&quot;,
&quot;title&quot;: &quot;non-english error&quot;
}</p>
<p><strong>Multiple supported languages</strong></p>
<p>The following rule groups errors where client.language.javascript does not contain en-,fr-,de-, or es-:
{
&quot;condition&quot;:{
&quot;all&quot;:[
{&quot;path&quot;:&quot;client.javascript.language&quot;,&quot;ncontains&quot;:&quot;en-&quot;},
{&quot;path&quot;:&quot;client.javascript.language&quot;,&quot;ncontains&quot;:&quot;fr-&quot;},
{&quot;path&quot;:&quot;client.javascript.language&quot;,&quot;ncontains&quot;:&quot;de-&quot;},
{&quot;path&quot;:&quot;client.javascript.language&quot;,&quot;ncontains&quot;:&quot;es-&quot;}
]
},
&quot;fingerprint&quot;: &quot;non-supported language error&quot;,
&quot;title&quot;: &quot;non-supported language error&quot;
}</p>