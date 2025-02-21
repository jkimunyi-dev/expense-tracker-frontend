import { NextResponse } from 'next/server';

// This is a temporary in-memory storage. In a real app, you'd use a database
let expenses = [];
let nextId = 1;

export async function GET() {
  return NextResponse.json(expenses);
}

export async function POST(request) {
  const expense = await request.json();
  const newExpense = {
    id: nextId++,
    ...expense,
    amount: Number(expense.amount),
    date: new Date(expense.date).toISOString(),
  };
  expenses.push(newExpense);
  return NextResponse.json(newExpense, { status: 201 });
}

export async function PUT(request) {
  const expense = await request.json();
  const index = expenses.findIndex(e => e.id === expense.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
  }
  expenses[index] = {
    ...expenses[index],
    ...expense,
    amount: Number(expense.amount),
    date: new Date(expense.date).toISOString(),
  };
  return NextResponse.json(expenses[index]);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const index = expenses.findIndex(e => e.id === Number(id));
  if (index === -1) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
  }
  expenses = expenses.filter(e => e.id !== Number(id));
  return NextResponse.json({ success: true });
}