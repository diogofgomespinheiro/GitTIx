import { Error as MongooseErrors } from 'mongoose';

import { Ticket } from '../Ticket';

describe('Ticket Model', () => {
  it('should implement optimistic concurrency control and throw a VersionError', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 25,
      userId: '123',
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance?.set({ price: 10 });
    secondInstance?.set({ price: 20 });

    await firstInstance?.save();

    await expect(secondInstance?.save()).rejects.toThrow(
      MongooseErrors.VersionError,
    );
  });

  it('should increment the version number on multiple saves', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 25,
      userId: '123',
    });

    await ticket.save();
    expect(ticket.version).toBe(0);
    await ticket.save();
    expect(ticket.version).toBe(1);
    await ticket.save();
    expect(ticket.version).toBe(2);
  });
});
