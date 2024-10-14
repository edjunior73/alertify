export interface EmailAdapterInterface {
  sendEmail(args: { to: string; subject: string; body: string }): Promise<void>
}
