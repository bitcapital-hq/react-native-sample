import { enBasic } from './basic';

export const en = {
  ...enBasic,

  Card: 'Card',
  Boleto: 'Boleto',
  Deposit: 'Deposit',
  Transfer: 'Transfer',
  Withdrawal: 'Withdrawal',
  Payment: 'Payment',
  CardPurchase: 'Online Payment',

  BALANCE: 'BALANCE',
  CARDHOLDER: 'CARD HOLDER',
  CARDNUMBER: 'CARD NUMBER',
  EXPIRATION: 'EXPIRATION',
  CVV: 'CVV',
  PERSONAL: 'PERSONAL',
  CORPORATE: 'CORPORATE',

  Onboarding: 'Onboarding',
  DefaultSecureConfirmMessage: 'Please confirm your identity',
  HelpScreenTitle: 'Help Center',
  WelcomeBack: 'Welcome back',
  CopiedToClipboard: 'Copied to Clipboard successfully!',
  AreYouSure: 'Are you sure?',
  Yes: 'Yes',
  No: 'No',
  ViewMore: 'View More',
  TransactionExecuted: 'Transaction executed',
  TransactionExecutedFull: 'Your transaction was executed successfully!',
  LatestTransactions: 'Latest Transactions',

  BoletoValidationScreenTitle: 'Boleto Information',
  BoletoValidationScreenSuccessAlert: 'Boleto was paid successfully!',

  ConfirmationScreenTitle: 'Confirm your Payment',
  ConfirmationScreenDescription: 'Enter the amount to be transfered',
  ConfirmationScreenSuccessAlert: 'Payment executed successfully!',

  DepositScreenTitle: 'Deposit funds',
  DepositScreenDescription: 'To get started, make a TED transfer to deposit funds into your account',

  HistoryScreenTitle: 'Wallet History',
  HistoryScreenDescription: 'Keep track of all your transactions',

  VirtualCardScreenTitle: 'Virtual Card',
  VirtualCardScreenDescription: 'Use virtual credit cards to make online purchases.',
  
  PaymentScreenTitle: 'Payments',
  PaymentScreenDescription: 'Pay a using a Wallet ID, QR or a Bar Code',
  PaymentInputPlaceholder: 'Enter the payment code',

  WithdrawalScreenTitle: 'Withdrawal',
  WithdrawalScreenDescription: 'Make a withdrawal to another bank account',
  WithdrawalScreenPickABank: 'Select a bank',
  WithdrawalScreenPickAccountType: 'Select an account type',

  BoletoEmitScreenTitle: 'Boleto emission',
  BoletoEmitScreenDescription: 'Emit a Boleto to add balance to your account',
  BoletoEmitScreenDatePlaceholder: 'Expiration date',

  BoletoEmitResultScreenTitle: 'Boleto Emitted',
  BoletoEmitResultScreenDescription: 'Boleto emitted, now its just pay!',

  LoginScreenTitle: 'Welcome',
  LoginScreenDescription: 'Enter your credentials',

  SettingsScreenTitle: 'Settings',
  SettingsScreenDescription: 'Manage your settings',
  SettingsScreenUseTouchId: 'Use Touch Id when acessing the app',

  CouldNotGetWalletInfo: 'Could not get the Wallet information',
  InvalidBarCode: 'Something went wrong, did you type your bar code correctly?',
  UnrecognizedQrCode: `Unrecognized QR Code, maybe it's not from Bit Capital`,
  UnknownError: 'Unknown Error',
  ErrorOnNewVirtualCard: 'Something went wrong while trying to create your card.',
  SomethingWentWrong: 'Something went wrong',
  WithdrawalError: 'An error happened during your withdrawal',
}

export const en_US = en;
export const en_UK = en;