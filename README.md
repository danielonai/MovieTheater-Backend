# HOME TASK CODE LOVERS

How to use this server:

## Setup

```
npm install
```

## Setup mongoDB and schema
```
.env.example to .env and configure the port and schema
```

## Setup prisma
```
npx prisma migrate dev --name init
npx prisma generate
```

## Seed DATA
```
npx prisma db seed
```

## Development

```
npm run dev
```