# ⬆ v2 -> v3

You can now decide if you want to allow partial translation for non falback language or not.  \
In practice, for language other than english (which is usually the fallback language) do you want red squigly lines under keys with `undefined`. \
\
As a result there is a new parameter of the function `createI18nApi`: `doAllowOptionalKeysForNonFallbackLanguage`

Update a basic setup: &#x20;

{% embed url="https://github.com/garronej/i18nifty/commit/8f2d28cce6519ac60a5a56f4f5f820a92d03681e#diff-e6662a502bb7521a37c2b32fc0d1e40109d03af87b889c6e42cef2ebfbfb2170" %}

Update a setup with async download of the resources:&#x20;

{% embed url="https://github.com/garronej/i18nifty/commit/8f2d28cce6519ac60a5a56f4f5f820a92d03681e#diff-691c7f3c77f365607340a26b05d441ed47c7724d48f59ba2096957532153c194" %}
Step 1
{% endembed %}

{% embed url="https://github.com/garronej/i18nifty/commit/8f2d28cce6519ac60a5a56f4f5f820a92d03681e#diff-1f0c18c3e7a9bb32fc1ef8640310dbc273e7749e68b03f725d52f3e37dd979c2" %}
Step 2
{% endembed %}

