===============================
Produce 101 Stats
===============================
.. image:: https://travis-ci.org/pmrowla/p101stat.svg
    :target: https://travis-ci.org/pmrowla/p101stat
.. image:: https://coveralls.io/repos/pmrowla/p101stat/badge.svg?branch=master&service=github
    :target: https://coveralls.io/github/pmrowla/p101stat?branch=master


Webapp for viewing Produce 101 vote statistics. Flask backend and React frontend.

The Mnet API is undocumented but if you are interested in using it the API fetch code in p101stat/utils.py should be pretty self explanatory.
The API for the p101stat website is also open to the internet, if you use it please be mindful of your bandwidth usage.

This app should run properly on any versions of Python that are supported by Flask (2.7 or >3.3 at the time of writing).

----------
Deployment
----------
This app is designed to be easily deployed on Heroku.
However, it appears that Mnet may be throttling and/or blocking any API requests from Heroku/AWS IP addresses, and as a result idol data cannot be reliably fetched from Heroku deployments at this time.

-------------
API endpoints
-------------
`/api/idols <http://p101.pmrowla.com/api/idols?q={%22order_by%22:[{%22field%22:%22vote_percentage%22,%22direction%22:%22desc%22}]}&results_per_page=101>`_
    The current (latest) idol data, this is used to populate the main frontend table

`/api/daily_history <http://p101.pmrowla.com/api/daily_history>`_
    This allows retrieval of past daily voting information.
    This data is not currently used in the frontend, but can be used to retrieve vote percentages and rankings from past dates.

For specifics on building API queries see the `Flask-Restless documentation <https://flask-restless.readthedocs.org/en/0.7.0/searchformat.html>`_.

------------------
Fetching Mnet data
------------------

Basic functionality for populating the p101stat database from Mnet's API is included in the `manage.py <./manage.py>`_ script.
For details on how to query the Mnet API yourself, see ``fetch_idol`` in `utils.py <./p101stat/utils.py#L16-L24>`_.

.. code:: bash

    # Fetch current vote totals and update entries for each Produce 101 idol
    $ python manage.py update_idols

    # Update the daily history table
    $ python manage.py update_dailies

These two commands are designed to be run using Heroku scheduler tasks, but they can also be run via standard cron jobs.
To recreate the behavior of the p101.pmrowla.com site, just run ``update_idols`` hourly, and ``update_dailies`` daily.
