import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Pétaouchnok-les-Bains — Abonnement Mensuel',
              description:
                'Lettre physique + indices + accès app interactive. Sans engagement.',
            },
            unit_amount: 1490,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/inscription?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement.' },
      { status: 500 }
    );
  }
}
