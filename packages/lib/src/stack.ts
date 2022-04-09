import { Networking } from "./networking"
import { PubSub } from "./pubsub";

export interface StackOptions {
  /**
   * The namespace of the stack.
   * 
   * All events, data, and peers will be scoped to this namespace.
   */
  namespace: string
  /**
   * Shared secret between peers.
   * 
   * If not provided, a secret will be generated from the namespace.
   * You can generate your own using `Networking.generatePSK()`
   */
  psk?: string
  /**
   * addresses to listen on
   */
  listen: string[]
}

export class Stack {
  private constructor(
    public readonly namespace: string,
    public readonly networking: Networking,
    public readonly pubsub: PubSub,
  ) { }

  async stop(): Promise<void> {
    await this.networking.stop()
  }

  static async create({ namespace, psk, listen }: StackOptions): Promise<Stack> {
    const networking = await Networking.create(namespace, listen, psk)
    const pubsub = new PubSub(namespace, networking)

    return new Stack(namespace, networking, pubsub);
  }
}
