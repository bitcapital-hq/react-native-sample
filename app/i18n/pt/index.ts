import { ptBasic } from './basic';

export const pt = {
  ...ptBasic,

  Card: 'Cartão',
  Boleto: 'Boleto',
  Deposit: 'Depósito',
  Transfer: 'Transferência',
  Withdrawal: 'Saque',
  Payment: 'Pagamento',

  BALANCE: 'SALDO',
  CARDHOLDER: 'PORTADOR',
  CARDNUMBER: 'NÚMERO DO CARTÃO',
  EXPIRATION: 'VALIDO ATÉ',
  CVV: 'CVV',
  PERSONAL: 'PESSOA FÍSICA',
  CORPORATE: 'PESSOA JURÍDICA',

  Onboarding: 'Cadastro',
  DefaultSecureConfirmMessage: 'Confirme sua identidade',
  HelpScreenTitle: 'Suporte',
  WelcomeBack: 'Bem vindo',
  CopiedToClipboard: 'Copiado para área de transferência!',
  AreYouSure: 'Tem certeza?',
  Yes: 'Sim',
  No: 'Não',
  ViewMore: 'Ver mais',
  TransactionExecuted: 'Transação executada',
  TransactionExecutedFull: 'Sua transação foi executada com sucesso!',
  LatestTransactions: 'Últimas Transações',

  BoletoValidationScreenTitle: 'Informações do Boleto',
  BoletoValidationScreenSuccessAlert: 'Boleto pago com sucesso!',

  ConfirmationScreenTitle: 'Confirme seu pagamento',
  ConfirmationScreenDescription: 'Digite o valor a ser transferido',
  ConfirmationScreenSuccessAlert: 'Pagamento executado com sucesso!',

  DepositScreenTitle: 'Depositar fundos',
  DepositScreenDescription: 'Para começar, mande uma TED para a conta abaixo',

  HistoryScreenTitle: 'Extrato',
  HistoryScreenDescription: 'Mantenha-se a par das transações na sua conta',

  VirtualCardScreenTitle: 'Cartão Virtual',
  VirtualCardScreenDescription: 'Use o cartão virtual nas suas compras online.',
  
  PaymentScreenTitle: 'Payments',
  PaymentScreenDescription: 'Enter the payment details or use the camera to scan QR and Bar codes.',
  PaymentInputPlaceholder: 'Wallet ID ou Código do Boleto, Tributo ou Convênio',

  BoletoEmitScreenTitle: 'Emitir Boleto',
  BoletoEmitScreenDescription: 'Emita um boleto para recarregar sua conta',
  BoletoEmitScreenDatePlaceholder: 'Data de vencimento',

  BoletoEmitResultScreenTitle: 'Boleto Emitido',
  BoletoEmitResultScreenDescription: 'Boleto emitido, agora é só pagar!',

  WithdrawalScreenTitle: 'TED',
  WithdrawalScreenDescription: 'Mande uma TED para outro banco',
  WithdrawalScreenPickABank: 'Selecione o banco',
  WithdrawalScreenPickAccountType: 'Selecione o tipo da conta',

  LoginScreenTitle: 'Bem Vindo',
  LoginScreenDescription: 'Inicie sua sessão na Bit Capital',

  SettingsScreenTitle: 'Configurações',
  SettingsScreenDescription: 'Ajuste o app da sua maneira',
  SettingsScreenUseTouchId: 'Pedir o Touch Id para acessar o app',

  CouldNotGetWalletInfo: 'Não foi possível puxar informações da wallet',
  InvalidBarCode: 'Algo deu errado, seu código de barras está certo?',
  UnrecognizedQrCode: `Não reconhecemos o QR Code, será que este é um QR Code sem ser da Bit Capital?`,
  UnknownError: 'Erro desconhecido',
  ErrorOnNewVirtualCard: 'Algo deu errado enquanto criavamos seu cartão virtual',
  SomethingWentWrong: 'Algo deu errado',
  WithdrawalError: 'Algo deu errado durante o envio da sua TED',

};

export const pt_US = pt;
export const pt_BR = pt;