import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import Donatefeed from './_components/donate-feed';

type Props = {}

export default function page({}: Props) {
  return (
    <div>
        <Donatefeed />
    </div>
  )
}