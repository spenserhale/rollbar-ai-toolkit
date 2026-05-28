<!-- source: https://docs.rollbar.com/docs/hiding-third-party-code.md -->

# Hiding Third-Party Code

<p>When using libraries or frameworks, you will often have large portions of well-tested third-party code unlikely to have caused an error. Rollbar will collapse stack frames from third-party code to keep the focus on your code.</p>
<img src="https://rollbar.wpengine.com/wp-content/uploads/2021/05/hiding-third-party-code.gif" alt="Hiding Third Party Code">
<p><strong>Single Root</strong>
To set this up, you must configure your SDK to send the server.root, or the prefix URL for all in-house stack frame filenames. Any code from outside the server.root directory will be collapsed by default when you load that item in the Rollbar UI.</p>
<p>For example, in a hypothetical stack trace with lines from the following files:

● /home/deploy/www/app/model.py
● /home/deploy/www/app/controller.py
● /home/deploy/www/vendor/webfmwk/eventloop.py
● /home/deploy/www/vendor/webfmwk/startup.py
● /home/deploy/www/app/main.py

</p>
<p>and with server.root set to /home/deploy/www/app, the lines from the vendor directory would be collapsed together to allow you to focus on your code and not the unlikely possibility that webfmk has a bug.</p>
<p><strong>Extra Roots</strong>
Sometimes you'll have to split your code into multiple sibling modules adjacent to folders you do not want to be included as project code (vendor, models, controllers, for instance). In these cases, you can send additional application roots in the project_package_paths key. These paths should look identical to the server root (the beginning of a URL), and the key should be in an array containing any additional folders to be considered &quot;in-project&quot;</p>

Please check out our Docs on <a href="https://docs.rollbar.com/docs/sdk-configurations#root--serverroot--branch">Server.Root</a> to learn more.</p>