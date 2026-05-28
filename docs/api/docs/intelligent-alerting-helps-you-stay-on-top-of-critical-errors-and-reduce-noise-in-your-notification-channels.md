<!-- source: https://docs.rollbar.com/docs/intelligent-alerting-helps-you-stay-on-top-of-critical-errors-and-reduce-noise-in-your-notification-channels.md -->

# Intelligent alerting helps you stay on top of critical errors and reduce noise in your notification channels

### Overview

<p>Discovering errors in a timely manner is crucial when it comes to fixing bugs in your product. Moreover, you should learn about an error before it is reported by your users. Setting up your alerts - for example <a href="https://docs.rollbar.com/docs/slack">enabling Slack notifications</a>- can give you a huge advantage and helps your team to quickly react to critical events in a given domain. However, a large number of alerts can be overwhelming and counterproductive. The important alerts might get lost in the avalanche of notifications, and you might not notice severe alerts in time.</p>
<p>One of the main problems causing alert noise is the under-specification of alerts created in a system. By providing insufficient parameters and filters and notifying unnecessarily large groups of users, you are essentially creating noise and causing problems in the future.</p>
<p>The best way to reduce alert noise is to create a set of specific alert rules targeting the smallest subset of necessary users. This will involve a bit of planning and configuration, but the overhead will pay off in the long run.</p>
<p>In this article, you will learn about:</p>
<ul>
<li>how best to set-up relevant channels and groups for notifications,</li>
<li>how to specify filters and parameters that notify the appropriate groups of people at the right times, and</li>
<li>how best to monitor and fine-tune alert thresholds.</li>
</ul>
<h3>Create dedicated notification channels and groups</h3>
<p>Keeping your team informed on incoming errors is vital, however the noise incurred by false positive alerts can cause users to ignore notifications, which can lead to critical errors being overlooked. </p>
<p>First, consider your project structure. Monolithic projects usually suffer from alert noise due to a large number of people working on the same code base, but microservice projects are more granular and typically do not have this problem. You will most likely need to fine tune any alerts added by default to your monolith project.</p>
<p>Next, consider your team structure. Depending on your organization’s DevOps practices, you may want to create environment-specific alerts or alerts targeting different parts of the software stack. Filtering by framework or file path can help to target these groups.</p>
<p>Setting up separate notification channels and notification groups based on the different notification types can eliminate the noise and help the appropriate teams see the relevant errors in a timely fashion. </p>
<h3>Set up filters and parameters to customize alerts</h3>
<p>To notify environment-based teams, you can use the built-in environment filter in the alert rules. For stack-based teams, you can use the framework filter to select different languages. </p>
<p>Package-based filtering can sometimes be accomplished using the Filename filter to match on keywords found in the file path.</p>
<p>You can add your own key-value pairs in your code to send over to Rollbar, and these can be used for advanced filtering using the Path filter. This way, you can be as granular as you need to be with team ownership of the code.</p>
<img src="https://rollbar.wpengine.com/wp-content/uploads/2021/05/Screen_Shot_2021-02-23_at_6.06.18_PM.png" alt="Set up filters and parameters to customize alerts">
<h3>Thresholding helps to prevent unnecessary notifications</h3>
<p>Changes in your team and in the usage of your product can cause on-off spikes or lead to upward trends with the number of incoming errors. With this, you should also optimize your alert settings.</p>
<p>Consider doing a periodic evaluation of any alerts that operate on hard number thresholds. For example, if the number of people using the software doubles, you may. need to double the threshold for some events to match the new expected volume.</p>