Feature: Branch cart
  As a customer
  I can add products to cart
  In order to checkout

  Background:
    Given there are following categories:
      | name                  |
      | Fruits and vegetables |
    And there are following producers:
      | name      |
      | Beth Rave |
    And producer "Beth Rave" has following products:
      | name                 | category              | description | price |
      | Basket of vegetables | Fruits and vegetables |             | 15    |
    And an association "Friends of organic food"
    And association "Friends of organic food" has following branches:
      | name     |
      | Branch 1 |
      | Branch 2 |
    And branch "Branch 1" has following calendar:
      | date      | from   | to     |
      | last week | 5 p.m. | 7 p.m. |
      | + 1 week  | 5 p.m. | 7 p.m. |
      | + 2 weeks | 5 p.m. | 7 p.m. |
      | + 3 weeks | 5 p.m. | 7 p.m. |
    And branch "Branch 2" has following calendar:
      | date      | from   | to     |
      | last week | 5 p.m. | 7 p.m. |
      | + 2 weeks | 5 p.m. | 7 p.m. |
      | + 4 weeks | 5 p.m. | 7 p.m. |
    And branch "Branch 1" has following producers:
      | name      |
      | Beth Rave |
    And branch "Branch 1" has following products:
      | producer  | product              |
      | Beth Rave | Basket of vegetables |

  Scenario Outline: See empty branch cart summary
    Given I am on "<url>"
    Then I should see "My cart (0)"
    And I should see the next date "<date>" formated "m-d"

  Examples:
    | url       | date      |
    | /branch-1 | + 1 week  |
    | /branch-2 | + 2 weeks |

  Scenario: Orders closed 1/2
    Given branch "Branch 1" has following calendar:
      | date     | from    | to     |
      | tomorrow | 12 a.m. | 2 a.m. |
    And I am on "/branch-1"
    Then I should not see "My cart"
    And I should see the next date "+ 1 week" formated "m-d"

  Scenario: Orders closed 2/2
    Given branch "Branch 1" has following calendar:
      | date      | from    | to         |
      | yesterday | 10 p.m. | 11:59 p.m. |
    And I am on "/branch-1"
    Then I should not see "My cart"
    And I should see the next date "+ 1 week" formated "m-d"

  Scenario: Add a product via category page
    Given I am on "/branch-1/fruits-and-vegetables"
    When I press "Add to cart"
    Then I should be on "/branch-1/cart"
    And I should see "My cart (1) €15.00"
    And I should see "Item has been added to cart."

  Scenario: Add a product via product page
    Given I am on "/branch-1/fruits-and-vegetables"
    And I follow "Basket of vegetables"
    When I press "Add to cart"
    Then I should be on "/branch-1/cart"
    And I should see "My cart (1) €15.00"
    And I should see "Item has been added to cart."

  Scenario: Add an existing product via product page
    Given I am on "/branch-1/fruits-and-vegetables"
    And I follow "Basket of vegetables"
    And I press "Add to cart"
    And I follow "Basket of vegetables"
    When I press "Add to cart"
    Then I should be on "/branch-1/cart"
    And I should see "My cart (1) €30.00"
    And I should see "Item has been added to cart."

  Scenario: Update quantity
    Given I am on "/branch-1/fruits-and-vegetables"
    And I follow "Basket of vegetables"
    And I press "Add to cart"
    And I change quantity to "3"
    When I press "Update"
    Then I should see "My cart (1) €45.00"
    And I should see "Cart has been updated."

  Scenario: Reset quantity (remove)
    Given I am on "/branch-1/fruits-and-vegetables"
    And I follow "Basket of vegetables"
    And I press "Add to cart"
    And I change quantity to "0"
    When I press "Update"
    Then I should see "My cart (0)"
    And I should see "Cart has been updated."
