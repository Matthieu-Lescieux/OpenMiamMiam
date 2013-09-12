Feature: Admin authentication & authorization
  In order to manage my informations
  I want to connect to the administration area

  Background:
    Given there are following users:
      | email          | password |
      | foo@bar.com    | secret1  |
      | john@doe.com   | secret2  |
      | john@smith.com | secret3  |
    Given there are following producers:
      | name        | managers                  |
      | Beth Rave   | john@doe.com              |
      | Elsa Dorsa  | foo@bar.com, john@doe.com |
      | Romeo Frigo |                           |

  Scenario: Access to the login page
    Given I am on "/login"
    Then I should be on "/login"
    And I should see "Login"

  Scenario: Redirect to the login
    Given I am on "/admin"
    Then I should be on "/login"
    And I should see "Login"

  Scenario: Log to the administration area but have no credentials
    Given I am on "/admin"
    And I should see "Login"
    When I fill username field with "john@smith.com"
    And I fill password field with "secret3"
    And I press login button
    Then the response status code should be 403

  Scenario: Redirect to producer's administration area after logged in
    Given I am on "/admin"
    And I should see "Login"
    When I fill username field with "foo@bar.com"
    And I fill password field with "secret1"
    And I press login button
    Then I should be on "/admin/producer/2/dashboard"
    And the administration area switcher value should be "0"

  Scenario: Choose administration area after logged in
    Given I am on "/admin"
    And I should see "Login"
    When I fill username field with "john@doe.com"
    And I fill password field with "secret2"
    And I press login button
    Then I should be on "/admin/"
    And I should see "Choose your administration area"
    When I fill administration area switcher with "1"
    And I press administration area switcher button
    Then I should be on "/admin/producer/2/dashboard"
    And the administration area switcher value should be "1"

  Scenario: Attempt to access not permitted administration area after login
    Given I am on "/admin"
    And I should see "Login"
    When I fill username field with "foo@bar.com"
    And I fill password field with "secret1"
    And I press login button
    Then I should be on "/admin/producer/2/dashboard"
    When I go to "/admin/producer/3/dashboard"
    Then the response status code should be 403