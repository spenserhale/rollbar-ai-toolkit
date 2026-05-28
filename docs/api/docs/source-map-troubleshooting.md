<!-- source: https://docs.rollbar.com/docs/source-map-troubleshooting.md -->

# Source Map Troubleshooting

<p>Rollbar applies source maps to exceptions from minified Javascript so you can view the original line and character numbers for debugging.  For full details on source maps in Rollbar, check out our <a href="https://docs.rollbar.com/docs/source-maps">Source Maps guide</a>.</p>
<h3>Do your source maps work locally?</h3>
<p>Source maps were originally developed to support local debugging of minified Javascript.  If you are not able to debug your minified Javascript code via your browser, then it will probably not work in Rollbar either.</p>
<p>For instructions on using source maps for local debugging, see <a href="https://developer.chrome.com/docs/devtools/javascript/source-maps/">this article</a> in Google's Tools for Web Developers.</p>
<h3>Are your source maps being successfully uploaded/downloaded?</h3>
<p>Rollbar provides a detailed view of known source maps for each project.  You can view it by going to <strong>Settings -&gt; Symbol Mapping -&gt; Source Maps</strong> in your Rollbar project.  This screen shows all attempt to access source maps, both successful and unsuccessful.  It includes a search feature that can be used to look for source maps for specific Javascript files.</p>
<img src="https://rollbar.wpengine.com/wp-content/uploads/2021/05/source-map.png" alt="Source Map">
<h3>Are your source maps valid?</h3>
<p>Sometimes source maps can be generated with no content in them, or in an invalid format, e.g. base64.  Check the source maps that are being uploaded to make sure they are in a human-readable format.</p>
<p>We also have this helpful <a href="https://github.com/rollbar/sm-tool">tool</a> to help check if your source map produces the correct mapping for the line numbers and column numbers from the exception.</p>
<h3>Are source maps enabled by default for older projects?</h3>
<p>If your project was created prior to <strong>May 16, 2017</strong>, then source maps are not enabled by default.  To enable source maps for these projects, go to <strong>Settings -&gt; Advanced -&gt; Migrations</strong> and enabled source maps by default.</p>
<img src="https://rollbar.wpengine.com/wp-content/uploads/2021/05/migrations.png" alt="Migrations">
<h3>Have you defined a code version in your source?</h3>
<p>If you are <a href="https://docs.rollbar.com/v1.0.0/reference#upload-a-js-source-map">uploading your source maps via the Rollbar API</a>, you must specify a version  value, which is typically a Git SHA or a semantic version number.</p>
<p>In order for Rollbar to know which source map applies to the code where an exception occurred, the exception must include the client.javascript.code_version  property, and it must match the version of the uploaded source map.</p>
<p>For instructions on configuring client.javascript.code_version in your exceptions, see the <a href="https://docs.rollbar.com/docs/rollbarjs-configuration-reference">rollbar.js configuration reference</a>.</p>
<h3>Source maps still not working?</h3>
<p>See our <a href="https://docs.rollbar.com/docs/source-maps#faq">Source maps FAQ</a> for more details and limitations of source maps in Rollbar, or get in touch with us via the in-app chat.</p>