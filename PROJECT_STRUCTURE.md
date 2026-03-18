# VCFE Project Structure (Chuẩn đề xuất)

Tài liệu này định nghĩa cấu trúc chuẩn cho frontend `vcfe` khi dùng **TanStack Router + TanStack Query + TypeScript**.

## 1) Nguyên tắc chính

- `routes/` chỉ chứa **route shell** (không nhét business logic nặng).
- Logic gọi API + cache đặt trong `features/*/queries` và `features/*/api`.
- Hook thuần UI/domain (không gọi TanStack Query trực tiếp) đặt trong `features/*/hooks`.
- Zustand chỉ giữ **UI state** (theme, sidebar, modal, filter), hạn chế giữ auth business state nếu đã dùng Query.
- `shared/` chỉ chứa phần dùng chung toàn app (api client, constants, utils, common hooks/types).

## 2) Cấu trúc thư mục chuẩn

```text
src/
  app/
    main.tsx
    providers/
      app-provider.tsx
      query-provider.tsx
      router-provider.tsx
    router/
      router.tsx
      routeTree.gen.ts
      guards.ts
    styles/
      globals.css
      scrollbar.css
      shadcn.css

  routes/                      # shell only
    __root.tsx
    _public.tsx
    _protected.tsx
    login.tsx
    _public/
      index.tsx
    _protected/
      index.tsx
      vocab/
        index.tsx
        $id.tsx
        create.tsx
      settings.tsx

  features/
    auth/
      api/
        auth.api.ts
      queries/
        auth.queries.ts
        auth.mutations.ts
      hooks/
        use-auth.ts
      store/
        auth.store.ts          # chỉ giữ nếu thực sự cần UI state
      types/
        auth.types.ts
      components/
        login-form.tsx
        user-avatar.tsx

    vocab/
      api/
        vocab.api.ts
      queries/
        vocab.queries.ts
        vocab.mutations.ts
      hooks/
        use-vocab-filter.ts
      store/
        vocab-filter.store.ts  # UI state filter/search/sort
      types/
        vocab.types.ts
      components/
        vocab-list.tsx
        vocab-detail.tsx
        vocab-form.tsx
        vocab-card.tsx

    user/
      api/
        user.api.ts
      queries/
        user.queries.ts
        user.mutations.ts
      types/
        user.types.ts
      components/
        settings-form.tsx

  shared/
    api/
      http.client.ts
      api.type.ts
    lib/
      cn.ts
      utils.ts
      date.ts
    hooks/
      use-debounce.ts
      use-disclosure.ts
    constants/
      routes.ts
      roles.ts
    types/
      common.types.ts
    store/
      ui.store.ts

  design-system/
    ui/
    primitives/
    patterns/
    tokens/

  test/
    setup.ts
    mocks/
    utils/
```

## 3) Quy ước file cần dùng (.ts/.tsx/.md)

- `.tsx`: React component, route shell, provider có JSX.
- `.ts`: api client, query config, types, utils, store, constants.
- `.md`: tài liệu kiến trúc, guideline, onboarding.

## 4) Quy ước đặt tên

- Component file: `kebab-case` (ví dụ `app-header.tsx`, `login-form.tsx`).
- Query file: `<feature>.queries.ts`, Mutation file: `<feature>.mutations.ts`.
- API file: `<feature>.api.ts`.
- Types file: `<feature>.types.ts`.
- Hook file: `use-*.ts`.

## 5) Auth flow khuyến nghị (Router + Query)

- Guard route dùng `queryClient.ensureQueryData` để kiểm tra/khôi phục session.
- `auth/me` và `auth/refresh` nên đặt trong `features/auth/queries` + `features/auth/api`.
- UI đọc trạng thái loading/error từ Query thay vì tự quản nhiều cờ rời rạc.
- Không lưu access token vào localStorage nếu yêu cầu bảo mật cao; ưu tiên refresh cookie + rehydrate session bằng API.

## 6) Checklist khi tạo module mới

1. Tạo `features/<module>/api/*.api.ts`
2. Tạo `features/<module>/queries/*.queries.ts` và `*.mutations.ts`
3. Tạo `features/<module>/types/*.types.ts`
4. Route chỉ import component/hook cần thiết, không viết logic API dày trong route
5. Chỉ thêm Zustand store khi là UI state

---

Nếu cần, có thể tách tiếp tài liệu thành:
- `docs/auth-flow.md`
- `docs/routing-guidelines.md`
- `docs/query-conventions.md`
