import { IntegrationBase } from "@budibase/types"
import Stripe from "stripe"

class CustomIntegration implements IntegrationBase {
  private readonly stripe: Stripe

  constructor(config: { apiKey: string; }) {
    this.stripe = new Stripe(config.apiKey, {
      apiVersion: '2022-08-01'
    })
  }

  async read(query: { 
    id: string, 
    type: string, 
    delivery_success: string, 
    ending_before: string, 
    limit: number, 
    starting_after: string ,
    created: object,
    extra: { [key: string]: string }
  }) {
    if (query.extra.type === "Mandates") {
      if (!query.id) {
        throw new Error("You must provide a mandate id!")
      }
      return await this.stripe.mandates.retrieve(query.id)
    }
    if (query.id) {
      return await this.stripe.events.retrieve(query.id)
    }
    return await this.stripe.events.list({
      type: query.type,
      delivery_success: query.delivery_success === "true",
      ending_before: query.ending_before,
      limit: query.limit,
      starting_after: query.starting_after,
      created: query.created
    })
  }
}

export default CustomIntegration