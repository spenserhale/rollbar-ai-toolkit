<!-- source: https://docs.rollbar.com/docs/grouping-occurrences.md -->

# Grouping (Reducing Noise)

Rollbar aggregates *Occurrences* caused by the same error into *Items* that represent application issues. The Rollbar UI gives insights into item behavior and impact (number of users affected, etc), helping you focus on the most impactful errors and easily distinguish between new and reoccurring errors. Our powerful customizable *notification engine* alerts you about new and urgent items.

Rollbar's grouping engine is continuously trained using machine learning to identify frequently occurring error types.

We provide powerful customization tools to refine our default grouping. You can merge items manually or write your own grouping rules for your specific cases.