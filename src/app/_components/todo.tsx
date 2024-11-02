"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function LatestTODO() {
  const [latestTodo] = api.todo.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createTodo = api.todo.create.useMutation({
    onSuccess: async () => {
      await utils.todo.invalidate();
      setName("");
    },
  });
  const [allTodos] = api.todo.getAll.useSuspenseQuery();
  const deleteTodo = api.todo.deleteById.useMutation({
    onSuccess: async () => {
      await utils.todo.invalidate();
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestTodo ? (
        <>
          <p className="truncate">Your most recent todo: {latestTodo.name}</p>
          <span className={"text-sm text-gray-400"}>
            click number to remove
          </span>
        </>
      ) : (
        <p>🎉 You have no todos yet.</p>
      )}
      <div>
        <h4 className="my-2 text-2xl font-bold">TODOs</h4>
        <ul className={"my-2"}>
          {allTodos?.map((todo) => (
            <div
              key={todo.id}
              className={"my-1 cursor-pointer hover:line-through"}
              onClick={() => deleteTodo.mutate({ id: todo.id })}
            >
              <span className={"font-mono"}> {todo.id} </span>
              <span>{todo.name}</span>
            </div>
          ))}
        </ul>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo.mutate({ name });
        }}
        className="mt-4 flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="+ todo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createTodo.isPending}
        >
          {createTodo.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
