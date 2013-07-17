<?php

class Model_Constant {

  const SCRIPT_NAME = 'Client Management';

  public static $_menu_information = array(
    array(
      'name'    =>  'Home',
      'url'     =>  'index',
      'class'   =>  'icon-home icon-white'
    ),
    array(
      'name'    =>  'Add Client',
      'url'     =>  'add',
      'class'   =>  'icon-user icon-white'
    ),
    array(
      'name'         =>  'Add Invoice',
      'url'          =>  'addInvoice',
      'class'        =>  'icon-white',
      'icon_content' =>  '$'
    ),
    array(
      'name'         =>  'Manage Custom Fields',
      'url'          =>  'customFields',
      'class'        =>  'icon-white icon-list',
    ),
  );

  protected static $_instance;

  /**
   * Retrieve singleton instance
   *
   * @return Model_Constant
   */
  public static function getInstance()
  {
    if (null === self::$_instance) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }

  /**
   * Reset the singleton instance
   *
   * @return void
   */
  public static function resetInstance()
  {
    self::$_instance = null;
  }

  public $client_flags = array(
    0 =>  'None',
    1 =>  'Green',
    2 =>  'Blue',
    3 =>  'Yellow',
    4 =>  'Red'
  );

  public $client_flags_class = array(
    0 =>  '',
    1 =>  'success',
    2 =>  'info',
    3 =>  'warning',
    4 =>  'error'
  );

  public $client_custom_field_small  = 1;
  public $client_custom_field_medium = 2;
  public $client_custom_field_large  = 3;

  public $client_custom_field_types = array(
    1 =>  'small',
    2 =>  'medium',
    3 =>  'large',
  );

}