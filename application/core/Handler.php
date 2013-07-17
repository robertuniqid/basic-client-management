<?php
/**
 * @author Andrei Robert Rusu
 * @throws Exception
 */
class Application_Handler{
  protected static $_instance;


  /**
   * Retrieve singleton instance
   *
   * @return Application_Handler
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

  /**
   * @var Model_Container
   */
  public $view;

  public function __construct() {

    $this->view = new Model_Container();

    $this->view->title = Model_Constant::SCRIPT_NAME . ' ';
    $include_scripts = array();

    if(Model_Helper_Request::fetchCurrentPage() == 'index')
      $include_scripts['assets/scripts/request_handler/application_list.js'] = 'Application.List.Init();';

    if(Model_Helper_Request::fetchCurrentPage() == 'customfields')
      $include_scripts['assets/scripts/request_handler/application_custom_fields.js']
          = 'Application.CustomFields.Init(' . json_encode(Model_Constant::getInstance()->client_custom_field_types) .  ');'
      ;

    $this->view->include_scripts = $include_scripts;
  }

  public function ajaxAction() {
    $dispatcher = new Model_AjaxDispatcher();

    $dispatcher->indexAction();
    exit;
  }

  public function indexAction() {
    $this->view->title .= '| Index';

    $entries = Model_Client::getInstance()->getAll();

    $invoice = Model_ClientInvoice::getInstance()->getAll();

    $invoice_map = Model_Operation_Array::mapByParam($invoice, 'client_id', true, true);

    foreach($entries as $entry_id => $entry)
      $entries[$entry_id]['invoice_total'] =
          isset($invoice_map[$entry_id]) ?
              array_sum(Model_Operation_Array::extractParam($invoice_map[$entry_id], 'amount'))
            : 0;

    $this->view->entries = $entries;

    Application_View::getInstance()->loadView('index.phtml', $this->view->getStorage());
  }

  public function addAction() {
    $this->view->title .= '| Add';

    Application_View::getInstance()->loadView('add.phtml', $this->view->getStorage());
  }

  public function postAddAction() {
    Model_Client::getInstance()->insert($_POST['info']);

    $this->_redirectAction('Client has been successfully set', 'index', 'success');
  }

  public function editAction() {
    $this->view->title .= '| Edit';

    $entry = Model_Client::getInstance()->getById(Model_Helper_Request::getParam('entry_id'));

    if(empty($entry))
      $this->_redirectAction('Invalid Request', 'index', 'error');

    $this->view->info = $entry;

    Application_View::getInstance()->loadView('edit.phtml', $this->view->getStorage());
  }

  public function postEditAction() {
    $info = Model_Helper_Request::getParam('info', array());

    $response = Model_Client::getInstance()->updateRecord($info['id'], $info);

    if($response == false)
      $this->_redirectAction('Something really bad just happened.', 'index', 'error');

    $this->_redirectAction('Client has been successfully edited', 'index', 'success');
  }

  public function viewAction() {
    $this->view->title .= '| View';

    $entry = Model_Client::getInstance()->getById(Model_Helper_Request::getParam('entry_id'));

    if(empty($entry))
      $this->_redirectAction('Invalid Request', 'index', 'error');

    $this->view->info = $entry;

    Application_View::getInstance()->loadView('view.phtml', $this->view->getStorage());
  }

  public function flagAction() {

    $flag_id = Model_Helper_Request::getParam('flag');

    $response = Model_Client::getInstance()->updateRecord(Model_Helper_Request::getParam('entry_id'),
                                                          array('flag'  =>  $flag_id));

    if($response == false)
      $this->_redirectAction('Something really bad just happened.', 'index', 'error');

    $this->_redirectAction('Client has been flagged : ' . Model_Constant::getInstance()->client_flags[$flag_id], 'index', 'success');
  }

  public function deleteAction() {

    $response = Model_Client::getInstance()->deleteRecord(Model_Helper_Request::getParam('entry_id'));

    if($response == false)
      $this->_redirectAction('Something really bad just happened.', 'index', 'error');

    $this->_redirectAction('Client has been successfully deleted', 'index', 'success');
  }

  public function errorAction() {
    $this->view->title = '';

    Application_View::getInstance()->loadView('error.phtml', $this->view->getStorage());
  }

  public function addInvoiceAction() {
    $this->view->title .= '| Add Invoice';

    $this->view->client_id = Model_Helper_Request::getParam('entry_id', 0);

    Application_View::getInstance()->loadView('add_invoice.phtml', $this->view->getStorage());
  }

  public function postAddInvoiceAction() {
    Model_ClientInvoice::getInstance()->insert($_POST['info']);

    $this->_redirectAction('Client Invoice has been successfully set', 'index', 'success');
  }

  public function editInvoiceAction() {
    $this->view->title .= '| Edit Invoice';

    $entry = Model_ClientInvoice::getInstance()->getById(Model_Helper_Request::getParam('entry_id'));

    if(empty($entry))
      $this->_redirectAction('Invalid Request', 'index', 'error');

    $this->view->info = $entry;

    Application_View::getInstance()->loadView('edit_invoice.phtml', $this->view->getStorage());
  }

  public function postEditInvoiceAction() {
    $info = Model_Helper_Request::getParam('info', array());

    $response = Model_ClientInvoice::getInstance()->updateRecord($info['id'], $info);

    if($response == false)
      $this->_redirectAction('Something really bad just happened.', 'index', 'error');

    $this->_redirectAction('Client Invoice has been successfully edited', 'index', 'success');
  }

  public function deleteInvoiceAction() {

    $response = Model_ClientInvoice::getInstance()->deleteRecord(Model_Helper_Request::getParam('entry_id'));

    if($response == false)
      $this->_redirectAction('Something really bad just happened.', 'index', 'error');

    $this->_redirectAction('Client Invoice has been successfully deleted', 'index', 'success');
  }

  public function customFieldsAction() {

    $this->view->title .= '| Custom Fields';

    $custom_fields = Model_CustomFields::getInstance()->getAll();

    $this->view->custom_fields = $custom_fields;

    Application_View::getInstance()->loadView('custom_fields.phtml', $this->view->getStorage());
  }

  private function _redirectAction($message, $redirect_url, $message_type = 'success') {
    $this->view->message = $message;
    $this->view->redirect_url = $redirect_url;
    $this->view->message_type = $message_type;

    Application_View::getInstance()->loadView('redirect.phtml', $this->view->getStorage());
    exit();
  }

}
