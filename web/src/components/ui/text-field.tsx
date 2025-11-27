import type { ComponentProps } from "react"
import { WarningIcon } from "@phosphor-icons/react"
import type { UseFormRegisterReturn } from "react-hook-form";

export function TextField({label, registration, error = "", prefix, name, placeholder}: ComponentProps<"input"> & { label?: string, registration?: UseFormRegisterReturn, error?: string, prefix?: string }) {
  return (
    <div className={`flex flex-col text-xs ${error ? 'text-feedback-danger font-bold' : 'text-gray-500 focus-within:text-blue-base focus-within:font-bold'}`}>
      <label htmlFor={name} className="mb-2 uppercase">{label}</label>
      
      <div className="bg-white border h-[48px] rounded-lg flex flex-row items-center px-4 overflow-hidden focus-within:border-blue-base">
        <span className="text-gray-500 font-normal">{prefix}</span>
        <input type="text" {...registration} placeholder={placeholder} className="w-full h-full outline-none" />
      </div>
      
      {error && (
        <span className="flex flex-row items-center text-sm text-gray-500 mt-1">
          <WarningIcon className="mr-1 text-feedback-danger" />
          {error}
        </span>
      )}
    </div>
  )
}